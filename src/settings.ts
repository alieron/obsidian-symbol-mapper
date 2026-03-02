import { App, PluginSettingTab, Setting } from "obsidian";
import SymbolMapperPlugin from "./main";

export interface SymbolMapperSettings {
	symbolMap: string;
}

export const DEFAULT_SETTINGS: SymbolMapperSettings = {
	symbolMap: `{
  "⁰": { "keywords": ["0", "zero", "superscript 0", "power 0"], "description": "Superscript zero" },
  "¹": { "keywords": ["1", "one", "superscript 1", "power 1"], "description": "Superscript one" },
  "²": { "keywords": ["2", "two", "square", "superscript 2", "power 2"], "description": "Superscript two" },
  "³": { "keywords": ["3", "three", "cube", "superscript 3", "power 3"], "description": "Superscript three" },
  "⁴": { "keywords": ["4", "four", "superscript 4", "power 4"], "description": "Superscript four" },
  "⁵": { "keywords": ["5", "five", "superscript 5", "power 5"], "description": "Superscript five" },
  "⁶": { "keywords": ["6", "six", "superscript 6", "power 6"], "description": "Superscript six" },
  "⁷": { "keywords": ["7", "seven", "superscript 7", "power 7"], "description": "Superscript seven" },
  "⁸": { "keywords": ["8", "eight", "superscript 8", "power 8"], "description": "Superscript eight" },
  "⁹": { "keywords": ["9", "nine", "superscript 9", "power 9"], "description": "Superscript nine" },

  "₀": { "keywords": ["0", "zero", "subscript 0"], "description": "Subscript zero" },
  "₁": { "keywords": ["1", "one", "subscript 1"], "description": "Subscript one" },
  "₂": { "keywords": ["2", "two", "subscript 2"], "description": "Subscript two" },
  "₃": { "keywords": ["3", "three", "subscript 3"], "description": "Subscript three" },
  "₄": { "keywords": ["4", "four", "subscript 4"], "description": "Subscript four" },
  "₅": { "keywords": ["5", "five", "subscript 5"], "description": "Subscript five" },
  "₆": { "keywords": ["6", "six", "subscript 6"], "description": "Subscript six" },
  "₇": { "keywords": ["7", "seven", "subscript 7"], "description": "Subscript seven" },
  "₈": { "keywords": ["8", "eight", "subscript 8"], "description": "Subscript eight" },
  "₉": { "keywords": ["9", "nine", "subscript 9"], "description": "Subscript nine" },

  "×": { "keywords": ["multiply", "multiplication", "times", "mul", "xx"], "description": "Multiplication sign" },
  "÷": { "keywords": ["divide", "division", "div"], "description": "Division sign" },
  "±": { "keywords": ["plus minus", "pm", "plusminus"], "description": "Plus-minus sign" },
  "∓": { "keywords": ["minus plus"], "description": "Minus-plus sign" },

  "=": { "keywords": ["equals", "equal"], "description": "Equals sign" },
  "≠": { "keywords": ["not equal", "neq"], "description": "Not equal sign" },
  "<": { "keywords": ["less than", "lt"], "description": "Less-than sign" },
  ">": { "keywords": ["greater than", "gt"], "description": "Greater-than sign" },
  "≤": { "keywords": ["less equal", "leq"], "description": "Less-than or equal to" },
  "≥": { "keywords": ["greater equal", "geq"], "description": "Greater-than or equal to" },

  "∞": { "keywords": ["infinity", "inf"], "description": "Infinity symbol" },
  "√": { "keywords": ["sqrt", "root", "square root"], "description": "Square root" },
  "∛": { "keywords": ["cube root"], "description": "Cube root" },
  "∜": { "keywords": ["fourth root"], "description": "Fourth root" },

  "∆": { "keywords": ["delta", "change"], "description": "Delta symbol" },
  "∇": { "keywords": ["nabla", "gradient"], "description": "Nabla symbol" },

  "°": { "keywords": ["degree", "deg"], "description": "Degree symbol" },
  "π": { "keywords": ["pi"], "description": "Pi constant" },
  "θ": { "keywords": ["theta"], "description": "Theta symbol" },
  "λ": { "keywords": ["lambda"], "description": "Lambda symbol" },
  "μ": { "keywords": ["mu", "micro"], "description": "Mu symbol" },
  "σ": { "keywords": ["sigma"], "description": "Sigma symbol" },
  "Ω": { "keywords": ["omega", "ohm"], "description": "Omega symbol" },
  "∂": { "keywords": ["del", "partial", "derivative"], "description": "Delta symbol(lower case)" },
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

