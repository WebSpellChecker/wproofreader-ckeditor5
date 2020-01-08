/**
 * The global storage of the script src.
 */
export default class SrcStorage {
	/**
	 * Creates an instance of the {@code SrcStorage}.
	 * @public
	 */
	constructor() {
		window.WPROOFREADER_SRCSTORAGE = window.WPROOFREADER_SRCSTORAGE || {};
	}

	/**
	 * Checks if the src of the script exists.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 */
	has(src) {
		return window.WPROOFREADER_SRCSTORAGE[src] ? true : false;
	}

	/**
	 * Adds a src of the script to the storage.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 */
	add(src) {
		window.WPROOFREADER_SRCSTORAGE[src] = {
			resolves: [],
			rejects: []
		};
	}

	/**
	 * Adds executable callbacks to the storage.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 * @param {Function} resolve - a {@code resolve} function of the {@code Promise}
	 * @param {Function} reject - a {@code reject} function of the {@code Promise}
	 */
	addCallbacks(src, resolve, reject) {
		window.WPROOFREADER_SRCSTORAGE[src].resolves.push(resolve);
		window.WPROOFREADER_SRCSTORAGE[src].rejects.push(reject);
	}

	/**
	 * Executes a provided callback function once for each {@code resolves} element.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 * @param {Function} callback - a function to be executed for each {@code resolves} element
	 */
	eachResolves(src, callback) {
		window.WPROOFREADER_SRCSTORAGE[src].resolves.forEach(callback);
	}

	/**
	 * Executes a provided callback function once for each {@code rejects} element.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 * @param {Function} callback - a function to be executed for each {@code rejects} element
	 */
	eachRejects(src, callback) {
		window.WPROOFREADER_SRCSTORAGE[src].rejects.forEach(callback);
	}

	/**
	 * Deletes the {@code WPROOFREADER_SRCSTORAGE} field by the passed src.
	 * @public
	 */
	delete(src) {
		delete window.WPROOFREADER_SRCSTORAGE[src];
	}
}
