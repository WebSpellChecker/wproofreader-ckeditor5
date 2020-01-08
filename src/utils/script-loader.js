import SrcStorage from './src-storage'

/**
 * Loads script asynchronously.
 */
export class ScriptLoader {
	/**
	 * Creates an instance of the {@code ScriptLoader}.
	 * @public
	 *
	 * @param {String} src - url of the script
	 */
	constructor(src) {
		this._src = src;
		this._globalSrcStorage = new SrcStorage();
	}

	/**
	 * Loads script by the passed url.
	 * @public
	 */
	load() {
		return new Promise((resolve, reject) => {
			this._validateSrc(reject);

			if (!this._isScriptOnPage()) {
				this._createScript(resolve, reject);
			} else {
				this._processExistingScript(resolve, reject);
			}
		});
	}

	/**
	 * Checks if the src of the script exists otherwise throws an {@code Error}.
	 * @private
	 */
	_validateSrc(reject) {
		if (!this._src) {
			reject(new Error("Path to the script is not specified."));
		}
	}

	/**
	 * Checks if the script exists on the page.
	 * @private
	 */
	_isScriptOnPage() {
		return document.querySelector('script[src="' + this._src + '"]') ? true : false;
	}

	/**
	 * Creates the script and add listeners for it.
	 * @private
	 */
	_createScript(resolve, reject) {
		this._script = this._createElement();

		this._globalSrcStorage.add(this._src);
		this._globalSrcStorage.addCallbacks(this._src, resolve, reject);

		this._subscribeOnScriptLoad();
		this._subscribeOnScriptError();

		this._appendScript();
	}

	/**
	 * Creates a script html element.
 	 * @private
	 */
	_createElement() {
		const script = document.createElement('script');
		script.type = 'text/javascript';
		script.charset = 'UTF-8';
		script.src = this._src;

		return script;
	}

	/**
	 * Subscribes on a load event of the script.
	 * @private
	 */
	_subscribeOnScriptLoad() {
		this._script.onload = () => {

			this._globalSrcStorage.eachResolves(this._src, (resolve) => {
				resolve();
			})

			this._destroy();
		};
	}

	/**
	 * Subscribes on an error event of the script.
	 * @private
	 */
	_subscribeOnScriptError() {
		this._script.onerror = () => {
			const error = new Error(`${this._src} failed to load.`);

			this._globalSrcStorage.eachRejects(this._src, (reject) => {
				reject(error);
			})

			this._destroy();
		};
	}

	/**
	 * Destroys the {@code SrciptLoader}.
	 * @private
	 */
	_destroy() {
		this._removeListeners();
		this._globalSrcStorage.delete(this._src);
		this._src = null;
		this._script = null;
	}

	/**
	 * Removes script listeners.
	 * @private
	 */
	_removeListeners() {
		this._script.onload = null;
		this._script.onerror = null;
	}

	/**
	 * Appends the script to the {@code head} block of a html page.
	 * @private
	 */
	_appendScript() {
		const head = document.getElementsByTagName('head')[0];

		head.appendChild(this._script);
	}

	/**
	 * Processes existing script.
	 * @private
	 */
	_processExistingScript(resolve, reject) {
		if (this._globalSrcStorage.has(this._src)) {
			this._globalSrcStorage.addCallbacks(this._src, resolve, reject);
		} else {
			resolve();
		}
	}
}
