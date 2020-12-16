import Command from '@ckeditor/ckeditor5-core/src/command';

/**
 * The {@code WProofreaderToggleCommand} to toggle the {@code WProofreader}.
 */
export default class WProofreaderToggleCommand extends Command {
	/**
	 * Executes the {@code WProofreaderToggleCommand}.
	 * @public
	 * @inheritDoc
	 */
	execute(options = {}) {
		const wproofreader = this.editor.plugins.get('WProofreader');

		wproofreader.toggle();
	}
}
