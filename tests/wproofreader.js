import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import WProofreader from '../src/wproofreader';
import { RealTimeCollaborativeEditing } from './mocks/mock-collaboration-editing';
import { RealTimeCollaborativeTrackChanges } from './mocks/mock-collaboration-editing';
import { RealTimeCollaborativeComments } from './mocks/mock-collaboration-editing';

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
		return element.remove();
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

		it('should contain appType option', () => {
			expect(wproofreader._options.appType).to.be.exist;
			expect(wproofreader._options.appType).to.be.equal('proofreader_ck5');
		});

		it('should not disable dialog option', () => {
			expect(wproofreader._options.disableDialog).to.be.false;
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

	describe('in CKEditor 5 collaboration mode', () => {
		it('should disable the dialog option of the WEBSPELLCHECKER because of RealTimeCollaborativeEditing plugin', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader, RealTimeCollaborativeEditing],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(editor.plugins.has('RealTimeCollaborativeEditing')).to.be.true;
					expect(wproofreader._options.disableDialog).to.be.true;
				});
		});

		it('should disable the dialog option of the WEBSPELLCHECKER because of RealTimeCollaborativeTrackChanges plugin', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader, RealTimeCollaborativeTrackChanges],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(editor.plugins.has('RealTimeCollaborativeTrackChanges')).to.be.true;
					expect(wproofreader._options.disableDialog).to.be.true;
				});
		});

		it('should disable the dialog option of the WEBSPELLCHECKER because of RealTimeCollaborativeComments plugin', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader, RealTimeCollaborativeComments],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(editor.plugins.has('RealTimeCollaborativeComments')).to.be.true;
					expect(wproofreader._options.disableDialog).to.be.true;
				});
		});

		it('should disable the dialog option of the WEBSPELLCHECKER because of collaboration plugins', () => {
			return ClassicEditor
				.create(element, {
					plugins: [
						WProofreader,
						RealTimeCollaborativeEditing,
						RealTimeCollaborativeTrackChanges,
						RealTimeCollaborativeComments
					],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(editor.plugins.has('RealTimeCollaborativeEditing')).to.be.true;
					expect(editor.plugins.has('RealTimeCollaborativeTrackChanges')).to.be.true;
					expect(editor.plugins.has('RealTimeCollaborativeComments')).to.be.true;
					expect(wproofreader._options.disableDialog).to.be.true;
				});
		});
	});

	describe('for multi root environment', () => {
		it('should disable the dialog option of the WEBSPELLCHECKER', () => {
			const editor = new ClassicEditor(element, {
				plugins: [WProofreader],
				wproofreader: WPROOFREADER_CONFIG
			});

			editor.editing.view.domRoots.set('main', element);
			editor.editing.view.domRoots.set('second', element);

			return editor.initPlugins()
				.then(() => {
					editor.ui.init(element);
					editor.data.init(element);

					editor.fire('ready');

					return editor;
				})
				.then(() => {
					const wproofreader = editor.plugins.get('WProofreader');

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

		describe('should synchronize WEBSPELLCHECKER options in the editor with', () => {
			let editor;

			beforeEach(() => {
				return editor = new ClassicEditor(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				});
			});

			afterEach(() => {
				return editor.destroy();
			});

			it('1 root', () => {
				editor.editing.view.domRoots.set('main', element);

				return editor.initPlugins()
					.then(() => {
						editor.ui.init(element);
						editor.data.init(element);

						editor.fire('ready');

						return editor;
					})
					.then(() => {
						const wproofreader = editor.plugins.get('WProofreader');

						const syncOptionsSpy = sinon.spy(wproofreader, '_syncOptions');
						const spy = sinon.spy(wproofreader._instances[0], 'commitOption');

						const languageCode = 'de_DE';
						wproofreader._instances[0].commitOption({
							lang: languageCode
						});

						expect(wproofreader._instances.length).to.be.equal(1);

						// Checks that the spy was called twice because it was called manually once.
						sinon.assert.calledTwice(spy);
						sinon.assert.calledOnce(syncOptionsSpy);
					});
			});

			it('3 roots', () => {
				editor.editing.view.domRoots.set('main', element);
				editor.editing.view.domRoots.set('second', element);
				editor.editing.view.domRoots.set('third', element);

				return editor.initPlugins()
					.then(() => {
						editor.ui.init(element);
						editor.data.init(element);

						editor.fire('ready');

						return editor;
					})
					.then(() => {
						const wproofreader = editor.plugins.get('WProofreader');

						const syncOptionsSpy = sinon.spy(wproofreader, '_syncOptions');
						const spies = [];

						for (let i = 0; i < wproofreader._instances.length; i++) {
							const spy = sinon.spy(wproofreader._instances[i], 'commitOption');
							spies.push(spy);
						}

						const languageCode = 'de_DE';
						wproofreader._instances[0].commitOption({
							lang: languageCode
						});

						expect(spies.length).to.be.equal(3);

						// Checks that the first spy was called twice because it was called manually once.
						sinon.assert.calledTwice(spies[0]);

						for (let i = 1; i < spies.length; i++) {
							sinon.assert.calledOnce(spies[i]);
						}

						sinon.assert.calledOnce(syncOptionsSpy);
					});
			});
		});
	});
});
