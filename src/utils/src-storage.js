
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
	 * @param {Function} resolve - {@code resolve} function of {@code Promise}
	 * @param {Function} reject - {@code reject} function of {@code Promise}
	 */
	addCallbacks(src, resolve, reject) {
		window.WPROOFREADER_SRCSTORAGE[src].resolves.push(resolve);
		window.WPROOFREADER_SRCSTORAGE[src].rejects.push(reject);
	}

	/**
	 * Goes through each {@code resolve} element of the passed src and execute it.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 * @param {Function} callback - a function to be executed by each {@code resolve} element
	 */
	eachResolves(src, callback) {
		window.WPROOFREADER_SRCSTORAGE[src].resolves.forEach(callback);
	}

	/**
	 * Goes through each {@code reject} element of the passed src and execute it.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 * @param {Function} callback - a function to be executed by each {@code reject} element
	 */
	eachRejects(src, callback) {
		window.WPROOFREADER_SRCSTORAGE[src].rejects.forEach(callback);
	}

	/**
	 * Deletes the specific {@code WPROOFREADER_SRCSTORAGE}.
	 * @public
	 */
	delete(src) {
		delete window.WPROOFREADER_SRCSTORAGE[src];
	}
}
