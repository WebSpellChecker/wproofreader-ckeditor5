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
				});
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
			expect(wproofreader).to.have.property('_userOptions');
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
				});
		});

		it('should not start for invalid container', () => {
			const span = document.createElement('span');
			document.body.appendChild(span);
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: Object.assign(WPROOFREADER_CONFIG, { container: span })
				})
				.then((editor) => {
					expect(editor.editing.view.getDomRoot('main')).to.not.be.equal(span);
				});
		});
	});

	describe('for multi root environment', () => {
		it('should disable the dialog option of the WEBSPELLCHECKER', () => {
			const classicEditor = new ClassicEditor(element, {
				plugins: [WProofreader],
				wproofreader: WPROOFREADER_CONFIG
			});

			classicEditor.editing.view.domRoots.set('main', element);
			classicEditor.editing.view.domRoots.set('second', element);

			return classicEditor.initPlugins()
				.then(() => {
					const wproofreader = classicEditor.plugins.get('WProofreader');

					expect(wproofreader._options.disableDialog).to.be.true;
				});
		});

		it('should not disable the dialog option of the WEBSPELLCHECKER', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(wproofreader._options.disableDialog).to.be.false;
				});
		});
	})
});
