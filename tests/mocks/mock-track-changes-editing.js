import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

export class TrackChanges extends Plugin {

	static get pluginName() {
		return 'TrackChanges';
	}

	static get requires() {
		return [TrackChangesEditing];
	}

	init() { }

	destroy() { }
}

export class TrackChangesEditing extends Plugin {

	static get pluginName() {
		return 'TrackChangesEditing';
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
