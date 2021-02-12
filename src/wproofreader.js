import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import WProofreaderEditing from './wproofreaderediting';
import WProofreaderUI from './wproofreaderui';
import { ScriptLoader } from './utils/script-loader';

/**
 * Initializes and creates instances of the {@code WEBSPELLCHECKER}.
 */
export default class WProofreader extends Plugin {
	/**
	 * @inheritdoc
	 */
	static get requires() {
		return [WProofreaderEditing, WProofreaderUI];
	}

	/**
	 * @inheritdoc
	 */
	static get pluginName() {
		return 'WProofreader';
	}

	/**
	 * @inheritDoc
	 */
	constructor(editor) {
		super(editor);

		this._instances = [];

		this._collaborationPluginNames = [
			'RealTimeCollaborativeEditing',
			'RealTimeCollaborativeTrackChanges',
			'RealTimeCollaborativeComments',
			'RealTimeCollaborationClient'
		];
	}

	/**
	 * Initializes the {@code WProofreader} plugin.
	 * @public
	 */
	init() {
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
	 * Checks if the theme option exists otherwise sets ckeditor5 theme.
	 * @private
	 */
	_setTheme() {
		if (!this._userOptions.theme) {
			this._userOptions.theme = 'ckeditor5';
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
	 * Creates options for the {@code WEBSPELLCHECKER} initialization.
	 * @private
	 */
	_createOptions() {
		return {
			appType: 'proofreader_ck5',
			disableDialog: this._isMultiRoot || this._isCollaboration,
			hideStaticActions: true,
			disableBadgePulsing: true,
			onCommitOptions: this._onCommitOptions.bind(this),
			onToggle: this._onToggle.bind(this)
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
	 * Synchronizes the changed options between each instance of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_syncOptions(changedOptions) {
		this._instances.forEach((instance) => {
			instance.commitOption(changedOptions, { ignoreCallback: true });
		});
	}

	/**
	 * Handles the {@code toggle} behavior of the {@code WEBSPELLCHECKER} instance.
	 * @private
	 */
	_onToggle(instance) {
		const enable = !instance.isDisabled();

		this._syncToggle(enable);
	}

	/**
	 * Synchronizes the toggle state between each instance of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_syncToggle(enable) {
		const options = { ignoreCallback: true };

		this._instances.forEach((instance) => {
			enable ? instance.enable(options) : instance.disable(options);
		});
	}

	/**
	 * Creates an instance of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_createInstance(root) {
		WEBSPELLCHECKER.init(this._mergeOptions(root), this._handleInstanceCreated.bind(this));
	}

	/**
	 * Creates the configuration of the {@code WEBSPELLCHECKER}.
	 * @private
	 */
	_mergeOptions(container) {
		return Object.assign({}, this._userOptions, this._options, { container: container });
	}

	/**
	 * Handles a state when an instance of the {@code WEBSPELLCHECKER} completely created.
	 * @private
	 */
	_handleInstanceCreated(instance) {
		if (!instance) {
			return;
		}

		if (this.editor.state === 'destroyed') {
			instance.destroy();

			return;
		}

		this._instances.push(instance);
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

	/**
	 * Returns available static actions of the {@code WEBSPELLCHECKER}.
	 * @public
	 *
	 * @returns {Array} Static actions.
	 */
	getStaticActions() {
		if (this._instances.length === 0) {
			return [];
		}

		return this._instances[0].getStaticActions();
	}

	/**
	 * Toggles instances state of the {@code WEBSPELLCHECKER}.
	 * @public
	 */
	toggle() {
		const options = { ignoreCallback: true };

		this._instances.forEach((instance) => {
			instance.isDisabled() ? instance.enable(options) : instance.disable(options);
		});
	}

	/**
	 * Opens settings of the {@code WEBSPELLCHECKER}.
	 * @public
	 */
	openSettings() {
		if (this._instances.length === 0) {
			return;
		}

		this._instances[0].openSettings();
	}

	/**
	 * Opens the proofread Dialog of the {@code WEBSPELLCHECKER}.
	 * @public
	 */
	openDialog() {
		if (this._instances.length === 0) {
			return;
		}

		this._instances[0].openDialog();
	}

	/**
	 * Indicates that instances of the {@code WEBSPELLCHECKER} are ready to use.
	 * @public
	 *
	 * @returns {Boolean} {@code true} if instances are ready, {@code false} otherwise.
	 */
	isInstancesReady() {
		return this._instances.length > 0;
	}

	/**
	 * Indicates that instances of the {@code WEBSPELLCHECKER} are enabled.
	 * @public
	 *
	 * @returns {Boolean} {@code true} if instances are enabled, {@code false} otherwise.
	 */
	isInstancesEnabled() {
		if (this._instances.length === 0) {
			return false;
		}

		return !this._instances[0].isDisabled();
	}
}
