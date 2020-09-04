import Command from '@ckeditor/ckeditor5-core/src/command';

/**
 * The {@code WProofreaderDialogCommand}.
 */
export default class WProofreaderDialogCommand extends Command {
	/**
	 * Executes the {@code WProofreaderDialogCommand}.
	 * @public
	 */
	execute(options = {}) {
		const wproofreader = this.editor.plugins.get('WProofreader');

		wproofreader.openDialog();
	}
}
