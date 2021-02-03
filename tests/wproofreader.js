import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import WProofreader from '../src/wproofreader';
import WProofreaderEditing from '../src/wproofreaderediting';
import WProofreaderUI from '../src/wproofreaderui';
import { RealTimeCollaborativeEditing } from './mocks/mock-collaboration-editing';
import { RealTimeCollaborativeTrackChanges } from './mocks/mock-collaboration-editing';
import { RealTimeCollaborativeComments } from './mocks/mock-collaboration-editing';
import { RealTimeCollaborationClient } from './mocks/mock-collaboration-editing';

describe('WProofreader', () => {
	const WPROOFREADER_CONFIG = {
		serviceProtocol: 'http',
		serviceHost: 'localhost',
		servicePort: '2880',
		servicePath: '/',
		srcUrl: 'http://localhost:3000/tests/mocks/mock-wscbundle.js'
	};

	let element;

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
					toolbar: ['wproofreader'],
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

		it('should require WProofreaderEditing and WProofreaderUI', () => {
			expect(WProofreader.requires).to.deep.equal([WProofreaderEditing, WProofreaderUI]);
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

		it('should hide static actions', () => {
			expect(wproofreader._options.hideStaticActions).to.be.true;
		});

		it('should disable badge pulsing', () => {
			expect(wproofreader._options.disableBadgePulsing).to.be.true;
		});
	});

	describe('with theme option', () => {
		it('should set ckeditor5 theme', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(wproofreader._userOptions.theme).to.be.equal('ckeditor5');
				})
		});

		it('should set user theme', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: Object.assign(WPROOFREADER_CONFIG, { theme: 'default' })
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(wproofreader._userOptions.theme).to.be.equal('default');
				})
		});
	})

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

		it('should disable the dialog option of the WEBSPELLCHECKER because of RealTimeCollaborationClient plugin', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader, RealTimeCollaborationClient],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(editor.plugins.has('RealTimeCollaborationClient')).to.be.true;
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
						RealTimeCollaborativeComments,
						RealTimeCollaborationClient
					],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(editor.plugins.has('RealTimeCollaborativeEditing')).to.be.true;
					expect(editor.plugins.has('RealTimeCollaborativeTrackChanges')).to.be.true;
					expect(editor.plugins.has('RealTimeCollaborativeComments')).to.be.true;
					expect(editor.plugins.has('RealTimeCollaborationClient')).to.be.true;
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

		describe('should synchronize WEBSPELLCHECKER toggle state in the editor with', () => {
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

						const syncToggleSpy = sinon.spy(wproofreader, '_syncToggle');
						const spy = sinon.spy(wproofreader._instances[0], 'disable');

						wproofreader._instances[0].disable();

						expect(wproofreader._instances.length).to.be.equal(1);

						// Checks that the spy was called twice because it was called manually once.
						sinon.assert.calledTwice(spy);
						sinon.assert.calledOnce(syncToggleSpy);
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

						const syncToggleSpy = sinon.spy(wproofreader, '_syncToggle');
						const spies = [];

						for (let i = 0; i < wproofreader._instances.length; i++) {
							const spy = sinon.spy(wproofreader._instances[i], 'disable');
							spies.push(spy);
						}

						wproofreader._instances[0].disable();

						expect(spies.length).to.be.equal(3);

						// Checks that the first spy was called twice because it was called manually once.
						sinon.assert.calledTwice(spies[0]);

						for (let i = 1; i < spies.length; i++) {
							sinon.assert.calledOnce(spies[i]);
						}

						sinon.assert.calledOnce(syncToggleSpy);
					});
			});
		});
	});

	describe('public API', () => {
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

		describe('getStaticActions method', () => {
			it('should return empty static actions if WEBSPELLCHECKER instances are not ready', () => {
				wproofreader._tempInstances = wproofreader._instances;
				wproofreader._instances = [];

				expect(wproofreader.getStaticActions().length).to.be.equal(0);

				wproofreader._instances = wproofreader._tempInstances;
				wproofreader._tempInstances = null;
			});

			it('should return static actions', () => {
				const actions = wproofreader.getStaticActions();

				expect(actions.length).to.be.equal(3);

				expect(actions[0].name).to.be.equal('toggle');
				expect(typeof actions[0].localization.default).to.be.equal('string');
				expect(typeof actions[0].localization.enable).to.be.equal('string');
				expect(typeof actions[0].localization.disable).to.be.equal('string');

				expect(actions[1].name).to.be.equal('settings');
				expect(typeof actions[1].localization.default).to.be.equal('string');
				expect(actions[1].localization.enable).to.be.undefined;
				expect(actions[1].localization.disable).to.be.undefined;

				expect(actions[2].name).to.be.equal('proofreadDialog');
				expect(typeof actions[2].localization.default).to.be.equal('string');
				expect(actions[2].localization.enable).to.be.undefined;
				expect(actions[2].localization.disable).to.be.undefined;
			});
		});

		describe('toggle method', () => {
			it('should disable WEBSPELLCHECKER instances', () => {
				const spy = sinon.spy(wproofreader._instances[0], 'disable');
				const syncToggleSpy = sinon.spy(wproofreader, '_syncToggle');

				wproofreader.toggle();

				sinon.assert.calledOnce(spy);
				sinon.assert.notCalled(syncToggleSpy);
			});

			it('should enable WEBSPELLCHECKER instances', () => {
				const spy = sinon.spy(wproofreader._instances[0], 'enable');
				const syncToggleSpy = sinon.spy(wproofreader, '_syncToggle');

				wproofreader._instances[0].disabled = true;

				wproofreader.toggle();

				sinon.assert.calledOnce(spy);
				sinon.assert.notCalled(syncToggleSpy);
			});
		});

		describe('openSettings method', () => {
			it('should not open settings', () => {
				const spy = sinon.spy(wproofreader._instances[0], 'openSettings');

				wproofreader._tempInstances = wproofreader._instances;
				wproofreader._instances = [];

				wproofreader.openSettings();

				sinon.assert.notCalled(spy);

				wproofreader._instances = wproofreader._tempInstances;
				wproofreader._tempInstances = null;
			});

			it('should open settings', () => {
				const spy = sinon.spy(wproofreader._instances[0], 'openSettings');

				wproofreader.openSettings();

				sinon.assert.calledOnce(spy);
			});
		});

		describe('openDialog method', () => {
			it('should not open dialog', () => {
				const spy = sinon.spy(wproofreader._instances[0], 'openDialog');

				wproofreader._tempInstances = wproofreader._instances;
				wproofreader._instances = [];

				wproofreader.openDialog();

				sinon.assert.notCalled(spy);

				wproofreader._instances = wproofreader._tempInstances;
				wproofreader._tempInstances = null;
			});

			it('should open dialog', () => {
				const spy = sinon.spy(wproofreader._instances[0], 'openDialog');

				wproofreader.openDialog();

				sinon.assert.calledOnce(spy);
			});
		});

		describe('isInstancesReady method', () => {
			it('should check if instances are not ready', () => {
				wproofreader._tempInstances = wproofreader._instances;
				wproofreader._instances = [];

				expect(wproofreader.isInstancesReady()).to.be.false;

				wproofreader._instances = wproofreader._tempInstances;
				wproofreader._tempInstances = null;
			});

			it('should check if instances are ready', () => {
				expect(wproofreader.isInstancesReady()).to.be.true;
			});
		});

		describe('isInstancesEnabled method', () => {
			it('should check if instances are disabled because they are not ready', () => {
				wproofreader._tempInstances = wproofreader._instances;
				wproofreader._instances = [];

				expect(wproofreader.isInstancesEnabled()).to.be.false;

				wproofreader._instances = wproofreader._tempInstances;
				wproofreader._tempInstances = null;
			});

			it('should check if instances are enabled', () => {
				expect(wproofreader.isInstancesEnabled()).to.be.true;
			});

			it('should check if instances are disabled', () => {
				wproofreader._instances[0].disabled = true;

				expect(wproofreader.isInstancesEnabled()).to.be.false;
			});
		});
	})
});
