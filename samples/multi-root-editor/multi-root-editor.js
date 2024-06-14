import { Editor, DataApiMixin, getDataFromElement, setDataInElement, mix } from 'ckeditor5';

import MultirootEditorUI from './multi-root-editor-ui.js';
import MultirootEditorUIView from './multi-root-editor-ui-view.js';

/**
 * The multi-root editor implementation. It provides inline editables and a single toolbar.
 *
 * Unlike other editors, the toolbar is not rendered automatically and needs to be attached to the DOM manually.
 *
 * This type of an editor is dedicated to integrations which require a customized UI with an open
 * structure, allowing developers to specify the exact location of the interface.
 *
 * @mixes module:core/editor/utils/dataapimixin~DataApiMixin
 * @implements module:core/editor/editorwithui~EditorWithUI
 * @extends module:core/editor/editor~Editor
 */
export default class MultirootEditor extends Editor {
	/**
	 * Creates an instance of the multi-root editor.
	 *
	 * **Note:** Do not use the constructor to create editor instances. Use the static `MultirootEditor.create()` method instead.
	 *
	 * @protected
	 * @param {Object.<String,HTMLElement>} sourceElements The list of DOM elements that will be the source
	 * for the created editor (on which the editor will be initialized).
	 * @param {module:core/editor/editorconfig~EditorConfig} config The editor configuration.
	 */
	constructor(sourceElements, config) {
		super(config);

		// Create root and UIView element for each editable container.
		for (const rootName of Object.keys(sourceElements)) {
			this.model.document.createRoot('$root', rootName);
		}

		this.ui = new MultirootEditorUI(this, new MultirootEditorUIView(this.locale, this.editing.view, sourceElements));
	}

	/**
	 * @inheritDoc
	 */
	destroy() {
		// Cache the data and editable DOM elements, then destroy.
		// It's safe to assume that the model->view conversion will not work after super.destroy(),
		// same as `ui.getEditableElement()` method will not return editables.
		const data = {};
		const editables = {};
		const editablesNames = Array.from(this.ui.getEditableElementsNames());

		for (const rootName of editablesNames) {
			data[rootName] = this.getData({ rootName });
			editables[rootName] = this.ui.getEditableElement(rootName);
		}

		this.ui.destroy();

		return super.destroy()
			.then(() => {
				for (const rootName of editablesNames) {
					setDataInElement(editables[rootName], data[rootName]);
				}
			});
	}

	/**
	 * Creates a multi-root editor instance.
	 *
	 * @param {Object.<String,HTMLElement>} sourceElements The list of DOM elements that will be the source
	 * for the created editor (on which the editor will be initialized).
	 * @param {module:core/editor/editorconfig~EditorConfig} config The editor configuration.
	 * @returns {Promise} A promise resolved once the editor is ready. The promise returns the created multi-root editor instance.
	 */
	static create(sourceElements, config) {
		return new Promise(resolve => {
			const editor = new this(sourceElements, config);

			resolve(
				editor.initPlugins()
					.then(() => editor.ui.init())
					.then(() => {
						const initialData = {};

						// Create initial data object containing data from all roots.
						for (const rootName of Object.keys(sourceElements)) {
							initialData[rootName] = getDataFromElement(sourceElements[rootName]);
						}

						return editor.data.init(initialData);
					})
					.then(() => editor.fire('ready'))
					.then(() => editor)
			);
		});
	}
}

mix(MultirootEditor, DataApiMixin);
