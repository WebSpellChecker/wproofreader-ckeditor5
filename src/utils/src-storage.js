/**
 * The global storage of the script src.
 */
export default class SrcStorage {
	/**
	 * Creates an instance of the {@code SrcStorage}.
	 * @public
	 */
	constructor() {
		this._create();
	}

	/**
	 * Creates the storage of the src of the script.
	 */
	_create() {
		window.WPROOFREADER_SRCSTORAGE = window.WPROOFREADER_SRCSTORAGE || {};
		this._storage = window.WPROOFREADER_SRCSTORAGE;
	}

	/**
	 * Checks if the src of the script exists.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 * @returns {Boolean} - {@code True} if src of the scripts exists {@code False} otherwise
	 */
	has(src) {
		return this._storage[src] ? true : false;
	}

	/**
	 * Adds a src of the script to the storage.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 */
	add(src) {
		this._storage[src] = {
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
		this._storage[src].resolves.push(resolve);
		this._storage[src].rejects.push(reject);
	}

	/**
	 * Executes a provided callback function once for each {@code resolves} element.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 * @param {Function} callback - a function to be executed for each {@code resolves} element
	 */
	eachOnLoad(src, callback) {
		this._storage[src].resolves.forEach(callback);
	}

	/**
	 * Executes a provided callback function once for each {@code rejects} element.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 * @param {Function} callback - a function to be executed for each {@code rejects} element
	 */
	eachOnError(src, callback) {
		this._storage[src].rejects.forEach(callback);
	}

	/**
	 * Deletes the {@code WPROOFREADER_SRCSTORAGE} field by the passed src.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 */
	delete(src) {
		delete this._storage[src];
	}

	/**
	 * Returns the {@code WPROOFREADER_SRCSTORAGE} field by the passed src.
	 * @public
	 *
	 * @param {String} src - a source of the script
	 */
	get(src) {
		return this._storage[src];
	}
}
