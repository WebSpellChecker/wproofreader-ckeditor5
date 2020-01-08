import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { ScriptLoader } from './utils/script-loader';

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
		this._config = this._getConfig();

		this._loadWscbundle()
			.then(() => {
				this._handleWscbundleLoaded();
			})
			.catch(error => {
				throw new Error(error);
			});
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
	 * Loads {@code wscbundle} script.
	 * @private
	 */
	_loadWscbundle() {
		const scriptLoader = new ScriptLoader(this._config.srcUrl);

		return scriptLoader.load();
	}

	/**
	 * Handles the {@code wscbundle} loaded state.
	 * @private
	 */
	_handleWscbundleLoaded() {
		if (this.editor.state === 'ready') {
			this._createInstances();
		} else {
			this._subscribeOnEditorReady();
		}
	}

	/**
	 * Creates {@code WEBSPELLCHECKER} intances.
	 * @private
	 */
	_createInstances() {
		const roots = this.editor.editing.view.domRoots.values();

		for (const root of roots) {
			this._createInstance(root);
		}
	}

	/**
	 * Creates an instance of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_createInstance(root) {
		WEBSPELLCHECKER.init(this._createConfig(root), this._saveInstance.bind(this));
	}

	/**
	 * Creates the configuration of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_createConfig(container) {
		return Object.assign(this._config, {
			container: container,
			appType: 'wp-ck5'
		});
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

	/**
	 * Subscribes on the ready state of the {@code CKEditor 5}.
	 * @private
	 */
	_subscribeOnEditorReady() {
		this.editor.on('ready', () => {
			this._createInstances();
		});
	}
}
