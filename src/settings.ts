import { App, PluginSettingTab, Setting } from "obsidian";
import SymbolMapperPlugin from "./main";

export interface SymbolMapperSettings {
	symbolMap: string;
}

export const DEFAULT_SETTINGS: SymbolMapperSettings = {
	symbolMap: `{
  "×": {
    "keywords": ["mul", "times", "xx"],
    "description": "Multiplication sign"
  },
  "¹": {
    "keywords": ["one", "1", "super"],
    "description": "Superscript one"
  }
}`
};

export class SymbolMapperSettingTab extends PluginSettingTab {
	plugin: SymbolMapperPlugin;

	constructor(app: App, plugin: SymbolMapperPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Symbol map")
			.setDesc("Map special characters to fuzzy search keywords.")
			.addTextArea((text) =>
				text
					.setPlaceholder(JSON.stringify(DEFAULT_SETTINGS))
					.setValue(this.plugin.settings.symbolMap)
					.onChange(async (value) => {
						this.plugin.settings.symbolMap = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

