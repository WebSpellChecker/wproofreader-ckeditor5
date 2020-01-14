import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import WProofreader from '../src/wproofreader';

describe('WProofreader', () => {
	let element;
	const WPROOFREADER_CONFIG = {
		serviceProtocol: 'http',
		serviceHost: 'localhost',
		servicePort: '2880',
		servicePath: '/',
		srcUrl: 'http://localhost:3000/tests/mocks/mock-wscbundle.js'
	};

	beforeEach(() => {
		element = document.createElement('div');
		document.body.appendChild(element);
	});

	afterEach(() => {
		element.remove();
	});

	describe('with correct configuration', () => {
		let testEditor, wproofreader;

		beforeEach(() => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					testEditor = editor;
					wproofreader = testEditor.plugins.get('WProofreader');
				})
		});

		afterEach(() => {
			wproofreader = null;

			return testEditor.destroy();
		});

		it('should be loaded', () => {
			expect(testEditor.plugins.has('WProofreader')).to.be.true;
			expect(wproofreader).to.be.instanceOf(WProofreader);
		});

		it('should contain wproofreader option', () => {
			expect(wproofreader).to.have.property('_config');
		});

		it('should save an instance of the WEBSPELLCHECKER', () => {
			expect(wproofreader._instances.length).to.equal(1);
		});
	});

	describe('with invalid configuration', () => {
		it('should not be load', () => {
			return ClassicEditor
				.create(element, {
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((testEditor) => {
					expect(testEditor.plugins.has('WProofreader')).to.be.false;
				})
		});
	});
});
