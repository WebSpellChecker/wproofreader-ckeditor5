import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import WProofreaderToggleCommand from './wproofreadertogglecommand';
import WProofreaderSettingsCommand from './wproofreadersettingscommand';
import WProofreaderDialogCommand from './wproofreaderdialogcommand';

/**
 * The {@code WProofreaderEditing} plugin. It introduces all {@code WProofreader} commands.
 */
export default class WProofreaderEditing extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'WProofreaderEditing';
	}

	/**
	 * Initializes the {@code WProofreaderEditing} plugin.
	 * @public
	 */
	init() {
		this._addCommands();
		this._enableInTrackChanges();
	}

	/**
	 * Adds the {@code WProofreader} commands to the editor.
	 * @private
	 */
	_addCommands() {
		this.editor.commands.add('WProofreaderToggle', new WProofreaderToggleCommand(this.editor));
		this.editor.commands.add('WProofreaderSettings', new WProofreaderSettingsCommand(this.editor));
		this.editor.commands.add('WProofreaderDialog', new WProofreaderDialogCommand(this.editor));
	}

	/**
	 * Enables the {@code WProofreader} commands in the Track Changes mode.
	 * @private
	 */
	_enableInTrackChanges() {
		const isTrackChangesLoaded = this.editor.plugins.has('TrackChanges');

		if (isTrackChangesLoaded) {
			const trackChangesEditing = this.editor.plugins.get('TrackChangesEditing');
			const commands = ['WProofreaderToggle', 'WProofreaderSettings', 'WProofreaderDialog'];

			commands.forEach((command) => trackChangesEditing.enableCommand(command));
		}
	}
}
