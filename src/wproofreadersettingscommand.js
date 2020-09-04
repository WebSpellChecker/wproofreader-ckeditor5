import Command from '@ckeditor/ckeditor5-core/src/command';

/**
 * The {@code WProofreaderSettingsCommand}.
 */
export default class WProofreaderSettingsCommand extends Command {
	/**
	 * Executes the {@code WProofreaderSettingsCommand}.
	 * @public
	 */
	execute(options = {}) {
		const wproofreader = this.editor.plugins.get('WProofreader');

		wproofreader.openSettings();
	}
}
