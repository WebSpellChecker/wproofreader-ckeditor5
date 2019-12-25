import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

/**
 * Initializes and creates instances of the {@code WEBSPELLCHECKER}.
 */
export default class WProofreader extends Plugin {
	/**
	 * Initializes the {@code WProofreader} plugin.
	 * @public
	 */
	init() {
		this._instances = [];
		this._subscribeOnEditorReady();
	}

	/**
	 * {@inheritdoc}
	 *
	 * Destroys the {@code WProofreader} plugin.
	 * @public
	 */
	destroy() {
		super.destroy();
		this._instances.forEach(instance => instance.destroy());
		this._instances = null;
	}

	/**
	 * Subscribes on the ready state of the {@code CKEditor 5}.
	 * @private
	 */
	_subscribeOnEditorReady() {
		this.editor.on('ready', this._handleEditorReady.bind(this));
	}

	/**
	 * Handles the {@code CKEditor 5} ready state.
	 * @private
	 */
	_handleEditorReady() {
		const config = this._getConfig();
		const roots = this.editor.editing.view.domRoots.values();

		for (const root of roots) {
			this._createInstance(root, config);
		}
	}

	/**
	 * Gets the configuration of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_getConfig() {
		const config = this.editor.config.get('wproofreader');

		if (!config) {
			throw new Error("No WProofreader configuration.");
		}

		return config;
	}

	/**
	 * Creates an instance of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_createInstance(root, config) {
		WEBSPELLCHECKER.init(this._createConfig(root, config), this._saveInstance.bind(this));
	}

	/**
	 * Creates the configuration of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_createConfig(container, config) {
		return Object.assign(config, { container: container });
	}

	/**
	 * Saves instance of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_saveInstance(instance) {
		if (instance) {
			this._instances.push(instance);
		}
	}
}
