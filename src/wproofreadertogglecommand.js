import Command from '@ckeditor/ckeditor5-core/src/command';

/**
 * The {@code WProofreaderToggleCommand}.
 */
export default class WProofreaderToggleCommand extends Command {
	/**
	 * Executes the {@code WProofreaderToggleCommand}.
	 * @public
	 */
	execute(options = {}) {
		const wproofreader = this.editor.plugins.get('WProofreader');

		wproofreader.toggle();
	}
}
