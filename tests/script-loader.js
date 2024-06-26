import { ScriptLoader } from "../src/utils/script-loader.js";

describe('ScriptLoader', () => {
	const src = 'http://localhost:3000/tests/mocks/mock-wscbundle.js';

	afterEach(() => {
		const script = getScript(src);

		if (script) {
			script.remove();
		}
	});

	it('should initialize necessary fields', () => {
		const scriptLoader = new ScriptLoader(src);

		expect(scriptLoader._src).to.be.equal(src);
		expect(scriptLoader._globalSrcStorage).to.be.exist;
	});

	it('should load the script', () => {
		const scriptLoader = new ScriptLoader(src);

		return scriptLoader.load()
			.then(() => {
				expect(getScript(src)).to.be.exist;
			});
	});

	it('should throw an error because of the invalid src of the script', () => {
		const func = () => new ScriptLoader();
		expect(func).to.throw();
	});

	it('_isScriptOnPage() method should return true', () => {
		const script = document.createElement('script');
		script.src = src;

		const head = document.getElementsByTagName('head')[0];
		head.appendChild(script);

		const isScriptOnPage = new ScriptLoader(src)._isScriptOnPage();
		expect(isScriptOnPage).to.be.true;
	});

	it('_isScriptOnPage() method should return false', () => {
		const isScriptOnPage = new ScriptLoader(src)._isScriptOnPage();
		expect(isScriptOnPage).to.be.false;
	});

	it('should create the script', () => {
		const scriptLoader = new ScriptLoader(src);

		const spy = sinon.spy(scriptLoader, '_createScript');

		return scriptLoader.load()
			.then(() => {
				sinon.assert.called(spy);

				const script = getScript(src);

				expect(script.src).to.be.equal(src);
				expect(script.type).to.be.equal('text/javascript');
				expect(script.charset).to.be.equal('UTF-8');
			});
	});

	it('should subscribe on script load', () => {
		const scriptLoader = new ScriptLoader(src);

		const spy = sinon.spy(scriptLoader, '_subscribeOnScriptLoad');

		return scriptLoader.load()
			.then(() => {
				sinon.assert.called(spy);
			});
	});

	it('should execute eachOnLoad method', () => {
		const scriptLoader = new ScriptLoader(src);

		const spy = sinon.spy(scriptLoader._globalSrcStorage, 'eachOnLoad');

		return scriptLoader.load()
			.catch(() => {
				sinon.assert.called(spy);
			});
	});

	it('should subscribe on script error', () => {
		const scriptLoader = new ScriptLoader(src);

		const spy = sinon.spy(scriptLoader, '_subscribeOnScriptError');

		return scriptLoader.load()
			.catch(() => {
				sinon.assert.called(spy);
			});
	});

	it('should execute eachOnError method', () => {
		const scriptLoader = new ScriptLoader('test.js');

		const spy = sinon.spy(scriptLoader._globalSrcStorage, 'eachOnError');

		return scriptLoader.load()
			.catch(() => {
				sinon.assert.called(spy);
			});
	});

	it('should not load the existing script', () => {
		const script = document.createElement('script');
		script.src = src;

		const head = document.getElementsByTagName('head')[0];
		head.appendChild(script);

		const scriptLoader = new ScriptLoader(src);
		const spy = sinon.spy(scriptLoader, '_processExistingScript');

		return scriptLoader.load()
			.then(() => {
				sinon.assert.called(spy);
			});
	});

	it('should destroy the ScriptLoader instance', () => {
		const scriptLoader = new ScriptLoader(src);

		const removeListenersSpy = sinon.spy(scriptLoader, '_removeListeners');
		const srcStorageDeleteSpy = sinon.spy(scriptLoader._globalSrcStorage, 'delete');

		return scriptLoader.load()
			.then(() => {
				sinon.assert.called(removeListenersSpy);
				sinon.assert.called(srcStorageDeleteSpy);

				expect(scriptLoader._src).to.be.null;
				expect(scriptLoader._script).to.be.null;
			});
	});

	it('should call _appendScript method', () => {
		const scriptLoader = new ScriptLoader(src);

		const spy = sinon.spy(scriptLoader, '_appendScript');

		return scriptLoader.load()
			.then(() => {
				sinon.assert.called(spy);

				expect(getScript(src)).to.be.exist;
			});
	});

	it('should append the script to the page', () => {
		const scriptLoader = new ScriptLoader(src);

		expect(getScript(src)).to.be.not.exist;

		const script = scriptLoader._createElement();
		scriptLoader._appendScript(script);

		expect(getScript(src)).to.be.exist;
	});

	it('should call _processLoadedScript method', () => {
		const script = document.createElement('script');
		script.src = src;
		script.async = false;

		const head = document.getElementsByTagName('head')[0];
		head.appendChild(script);

		const scriptLoader = new ScriptLoader(src);
		const spy = sinon.spy(scriptLoader, '_processLoadedScript');

		return scriptLoader.load()
			.then(() => {
				sinon.assert.called(spy);
			});
	});

	it('should call _addCallbacks method', () => {
		const scriptLoader = new ScriptLoader(src);
		const newScriptLoader = new ScriptLoader(src);

		const spy = sinon.spy(newScriptLoader, '_addCallbacks');

		scriptLoader.load();

		return newScriptLoader.load()
			.then(() => {
				sinon.assert.called(spy);
			});
	});
});

/**
 * Returns the script by the passed src.
 *
 * @param {String} src - a source of the script
 */
function getScript(src) {
	return document.querySelector('script[src="' + src + '"]');
}

