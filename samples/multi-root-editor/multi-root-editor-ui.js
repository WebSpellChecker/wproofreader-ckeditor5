import EditorUI from '@ckeditor/ckeditor5-ui/src/editorui/editorui';
import { enablePlaceholder } from '@ckeditor/ckeditor5-engine/src/view/placeholder';

/**
 * The multi-root editor UI class.
 *
 * @extends module:core/editor/editorui~EditorUI
 */
export default class MultirootEditorUI extends EditorUI {
	/**
	 * Creates an instance of the multi-root editor UI class.
	 *
	 * @param {module:core/editor/editor~Editor} editor The editor instance.
	 * @param {module:ui/editorui/editoruiview~EditorUIView} view The view of the UI.
	 */
	constructor(editor, view) {
		super(editor);

		/**
		 * The main (top–most) view of the editor UI.
		 *
		 * @readonly
		 * @member {module:ui/editorui/editoruiview~EditorUIView} #view
		 */
		this.view = view;
	}

	/**
	 * Initializes the UI.
	 */
	init() {
		const view = this.view;
		const editor = this.editor;
		const editingView = editor.editing.view;

		let lastFocusedEditableElement;

		view.render();

		// Keep track of the last focused editable element. Knowing which one was focused
		// is useful when the focus moves from editable to other UI components like balloons
		// (especially inputs) but the editable remains the "focus context" (e.g. link balloon
		// attached to a link in an editable). In this case, the editable should preserve visual
		// focus styles.
		this.focusTracker.on('change:focusedElement', (evt, name, focusedElement) => {
			for (const editable of this.view.editables) {
				if (editable.element === focusedElement) {
					lastFocusedEditableElement = editable.element;
				}
			}
		});

		// If the focus tracker loses focus, stop tracking the last focused editable element.
		// Wherever the focus is restored, it will no longer be in the context of that editable
		// because the focus "came from the outside", as opposed to the focus moving from one element
		// to another withing the editor UI.
		this.focusTracker.on('change:isFocused', (evt, name, isFocused) => {
			if (!isFocused) {
				lastFocusedEditableElement = null;
			}
		});

		for (const editable of this.view.editables) {
			// The editable UI element in DOM is available for sure only after the editor UI view has been rendered.
			// But it can be available earlier if a DOM element has been passed to MultirootEditor.create().
			const editableElement = editable.element;

			// Register each editable UI view in the editor.
			this.setEditableElement(editable.name, editableElement);

			// Let the editable UI element respond to the changes in the global editor focus
			// tracker. It has been added to the same tracker a few lines above but, in reality, there are
			// many focusable areas in the editor, like balloons, toolbars or dropdowns and as long
			// as they have focus, the editable should act like it is focused too (although technically
			// it isn't), e.g. by setting the proper CSS class, visually announcing focus to the user.
			// Doing otherwise will result in editable focus styles disappearing, once e.g. the
			// toolbar gets focused.
			editable.bind('isFocused').to(this.focusTracker, 'isFocused', this.focusTracker, 'focusedElement',
				(isFocused, focusedElement) => {
					// When the focus tracker is blurred, it means the focus moved out of the editor UI.
					// No editable will maintain focus then.
					if (!isFocused) {
						return false;
					}

					// If the focus tracker says the editor UI is focused and currently focused element
					// is the editable, then the editable should be visually marked as focused too.
					if (focusedElement === editableElement) {
						return true;
					}
					// If the focus tracker says the editor UI is focused but the focused element is
					// not an editable, it is possible that the editable is still (context–)focused.
					// For instance, the focused element could be an input inside of a balloon attached
					// to the content in the editable. In such case, the editable should remain _visually_
					// focused even though technically the focus is somewhere else. The focus moved from
					// the editable to the input but the focus context remained the same.
					else {
						return lastFocusedEditableElement === editableElement;
					}
				});

			// Bind the editable UI element to the editing view, making it an end– and entry–point
			// of the editor's engine. This is where the engine meets the UI.
			editingView.attachDomRoot(editableElement, editable.name);
		}

		this._initPlaceholder();
		this._initToolbar();
		this.fire('ready');
	}

	/**
	 * @inheritDoc
	 */
	destroy() {
		const view = this.view;
		const editingView = this.editor.editing.view;

		for (const editable of this.view.editables) {
			editingView.detachDomRoot(editable.name);
		}

		view.destroy();

		super.destroy();
	}

	/**
	 * Initializes the editor main toolbar and its panel.
	 *
	 * @private
	 */
	_initToolbar() {
		const toolbar = this.view.toolbar;

		toolbar.fillFromConfig(this.editor.config.get('toolbar'), this.componentFactory);
		this.editor.ui.addToolbar(toolbar)
	}

	/**
	 * Enable the placeholder text on the editing root, if any was configured.
	 *
	 * @private
	 */
	_initPlaceholder() {
		const editor = this.editor;
		const editingView = editor.editing.view;

		for (const editable of this.view.editables) {
			const editingRoot = editingView.document.getRoot(editable.name);
			const sourceElement = this.getEditableElement(editable.name);

			const placeholderText = editor.config.get('placeholder')[editable.name] ||
				sourceElement && sourceElement.tagName.toLowerCase() === 'textarea' && sourceElement.getAttribute('placeholder');

			if (placeholderText) {
				enablePlaceholder({
					view: editingView,
					element: editingRoot,
					text: placeholderText,
					isDirectHost: false
				});
			}
		}
	}
}
