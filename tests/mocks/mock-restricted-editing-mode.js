import { Plugin } from 'ckeditor5/src/core.js';

export class RestrictedEditingMode extends Plugin {

	static get pluginName() {
		return 'RestrictedEditingMode';
	}

	static get requires() {
		return [RestrictedEditingModeEditing];
	}

	init() { }

	destroy() { }
}

export class RestrictedEditingModeEditing extends Plugin {

	static get pluginName() {
		return 'RestrictedEditingModeEditing';
	}

	constructor() {
		super();

		this.counter = 0;
	}

	init() { }

	enableCommand() {
		this.counter++;
	}

	destroy() { }
}
