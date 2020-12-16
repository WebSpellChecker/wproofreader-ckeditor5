import Command from '@ckeditor/ckeditor5-core/src/command';

/**
 * The {@code WProofreaderDialogCommand} to open the {@code WProofreader} dialog.
 */
export default class WProofreaderDialogCommand extends Command {
	/**
	 * Executes the {@code WProofreaderDialogCommand}.
	 * @public
	 * @inheritDoc
	 */
	execute(options = {}) {
		const wproofreader = this.editor.plugins.get('WProofreader');

		wproofreader.openDialog();
	}
}
