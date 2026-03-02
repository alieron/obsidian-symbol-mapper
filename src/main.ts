import {
	App,
	Plugin,
	FuzzySuggestModal,
	FuzzyMatch,
	prepareFuzzySearch,
	MarkdownView
} from "obsidian";

import { SymbolMapperSettings, SymbolMapperSettingTab, DEFAULT_SETTINGS } from "./settings";

interface SymbolEntry {
	keywords: string[];
	description?: string;
}

interface SymbolMap {
	[char: string]: SymbolEntry;
}

export default class SymbolMapperPlugin extends Plugin {
	settings: SymbolMapperSettings;
	symbolMap: SymbolMap;

	async onload() {
		await this.loadSettings();
		this.parseCharMap();

		this.addCommand({
			id: "open-symbol-search",
			name: "Insert symbol",
			// hotkeys: [
			// 	{ modifiers: ["Ctrl", "Shift"], key: "/" }
			// ],
			callback: () => {
				new SymbolSearchModal(this.app, this.symbolMap).open();
			}
		});

		this.addSettingTab(new SymbolMapperSettingTab(this.app, this));
	}

	parseCharMap() {
		try {
			this.symbolMap = JSON.parse(this.settings.symbolMap) as SymbolMap;
		} catch (e) {
			console.error("Invalid JSON in settings:", e);
			this.symbolMap = {};
		}
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		) as SymbolMapperSettings;
	}

	async saveSettings() {
		await this.saveData(this.settings);
		this.parseCharMap();
	}
}


class SymbolSearchModal extends FuzzySuggestModal<string> {
	symbolMap: SymbolMap;

	constructor(app: App, symbolMap: SymbolMap) {
		super(app);
		this.symbolMap = symbolMap;
	}

	getItems(): string[] {
		return Object.keys(this.symbolMap);
	}

	getItemText(item: string): string {
		// const entry = this.symbolMap[item];
		// if (entry && entry.description) {
		// 	return `${item} - ${entry.description}`;
		// }
		return item;
	}

	// fuzzy search should match keywords and nothing else
	getSuggestions(query: string): FuzzyMatch<string>[] {
		if (!query) {
			return this.getItems().map((char) => ({
				item: char,
				match: { score: 0, matches: [] }
			}));
		}

		const lower = query.toLowerCase();
		const results: FuzzyMatch<string>[] = [];

		for (const char of Object.keys(this.symbolMap)) {
			const entry = this.symbolMap[char];

			if (!entry) continue;

			// what counts as searchable text
			const searchable = [
				// char,
				// entry.description ?? "",
				...entry.keywords
			].join(" ");

			const search = prepareFuzzySearch(lower);
			const match = search(searchable);

			if (match) {
				results.push({
					item: char,
					match
				});
			}
		}

		return results.sort((a, b) => b.match.score - a.match.score);
	}

	renderSuggestion(match: FuzzyMatch<string>, el: HTMLElement) {
		const char = match.item;
		const entry = this.symbolMap[char];

		el.empty();

		const container = el.createDiv({
			cls: "symbol-suggestion"
		});

		container.createSpan({
			text: char,
			cls: "symbol"
		});

		if (entry && entry.description) {
			container.createSpan({
				text: ` - ${entry.description}`,
				cls: "symbol-description"
			});
		}
	}

	onChooseItem(char: string): void {
		const view = this.app.workspace.getActiveViewOfType(MarkdownView);
		if (!view) return;

		view.editor.replaceSelection(char);
	}
}
