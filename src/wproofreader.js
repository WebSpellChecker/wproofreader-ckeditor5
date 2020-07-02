import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import { ScriptLoader } from './utils/script-loader';

/**
 * Initializes and creates instances of the {@code WEBSPELLCHECKER}.
 */
export default class WProofreader extends Plugin {
	/**
	 * @inheritdoc
	 */
	static get pluginName() {
		return 'WProofreader';
	}

	/**
	 * Initializes the {@code WProofreader} plugin.
	 * @public
	 */
	init() {
		this._instances = [];
		this._collaborationPluginNames = [
			'RealTimeCollaborativeEditing',
			'RealTimeCollaborativeTrackChanges',
			'RealTimeCollaborativeComments',
			'RealTimeCollaborationClient'
		];

		this._userOptions = this._getUserOptions();
		this._setTheme();

		this._loadWscbundle()
			.then(() => {
				this._handleWscbundleLoaded();
			})
			.catch((error) => {
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
		this._instances.forEach((instance) => instance.destroy());
		this._instances = null;
	}

	/**
	 * Gets the configuration of the {@code WEBSPELLCHECKER} from the {@code CKEditor 5} config.
	 * @private
	 */
	_getUserOptions() {
		const config = this.editor.config.get('wproofreader');

		if (!config) {
			throw new Error('No WProofreader configuration.');
		}

		return config;
	}

	/**
	 * Checks if the theme option exists otherwise sets gray theme.
	 * @private
	 */
	_setTheme() {
		if (!this._userOptions.theme) {
			this._userOptions.theme = 'gray';
		}
	}

	/**
	 * Loads {@code wscbundle} script.
	 * @private
	 */
	_loadWscbundle() {
		const scriptLoader = new ScriptLoader(this._userOptions.srcUrl);

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

		this._setFields();

		for (const root of roots) {
			this._createInstance(root);
		}
	}

	/**
	 * Sets extra fields related to the {@code WEBSPELLCHECKER} instance creating.
	 * @private
	 */
	_setFields() {
		this._isMultiRoot = this._checkMultiRoot();
		this._isCollaboration = this._checkCollaborationMode();
		this._options = this._createOptions();
	}

	/**
	 * Checks if the current editor has several roots.
	 * @private
	 */
	_checkMultiRoot() {
		return this.editor.editing.view.domRoots.size > 1 ? true : false;
	}

	/**
	 * Checks if the current editor in the real-time collaboration mode.
	 * @private
	 */
	_checkCollaborationMode() {
		for (let i = 0; i <= this._collaborationPluginNames.length; i++) {
			if (this.editor.plugins.has(this._collaborationPluginNames[i])) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Creates {@code WEBSPELLCHECKER} specific options.
	 * @private
	 */
	_createOptions() {
		return {
			appType: 'proofreader_ck5',
			disableDialog: this._isMultiRoot || this._isCollaboration,
			onCommitOptions: this._onCommitOptions.bind(this)
		};
	}

	/**
	 * Handles the {@code commitOptions} behavior of the {@code WEBSPELLCHECKER} instance.
	 * @private
	 */
	_onCommitOptions(changedOptions) {
		this._syncOptions(changedOptions);
	}

	/**
	 * Synchronizes the changed options between the each instance of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_syncOptions(changedOptions) {
		this._instances.forEach((instance) => {
			instance.commitOption(changedOptions, { ignoreCallback: true });
		});
	}

	/**
	 * Creates an instance of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_createInstance(root) {
		WEBSPELLCHECKER.init(this._mergeOptions(root), this._saveInstance.bind(this));
	}

	/**
	 * Creates the configuration of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_mergeOptions(container) {
		return Object.assign(this._userOptions, this._options, { container: container });
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
