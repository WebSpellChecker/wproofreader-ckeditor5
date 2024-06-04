import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import WProofreader from '../src/wproofreader.js';
import WProofreaderEditing from '../src/wproofreaderediting.js';
import WProofreaderUI from '../src/wproofreaderui.js';
import { RealTimeCollaborativeEditing } from './mocks/mock-collaboration-editing.js';
import { RealTimeCollaborativeTrackChanges } from './mocks/mock-collaboration-editing.js';
import { RealTimeCollaborativeComments } from './mocks/mock-collaboration-editing.js';
import { RealTimeCollaborationClient } from './mocks/mock-collaboration-editing.js';
import { RestrictedEditingMode } from './mocks/mock-restricted-editing-mode.js';

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
		let testEditor, wproofreader, command;

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
					command = testEditor.commands.get('WProofreaderToggle');
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

		it('should contain isToggleCommandEnabled option', () => {
			expect(wproofreader).to.have.property('isToggleCommandEnabled', true);
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

		it('should contain restrictedEditingMode option', () => {
			expect(wproofreader._options.restrictedEditingMode).to.be.false;
		});

		it('should disable badge pulsing', () => {
			expect(wproofreader._options.disableBadgePulsing).to.be.true;
		});

		it('should have isToggleCommandEnabled bound to the WProofreaderToggle command\'s isEnabled', () => {
			command.isEnabled = true;
			expect(wproofreader).to.have.property('isToggleCommandEnabled', true);

			command.isEnabled = false;
			expect(wproofreader).to.have.property('isToggleCommandEnabled', false);
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
					wproofreader: Object.assign({}, WPROOFREADER_CONFIG, { theme: 'default' })
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(wproofreader._userOptions.theme).to.be.equal('default');
				})
		});
	})

	describe('with autoStartup option', () => {
		it('should set `true` to the autoStartup option', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(wproofreader._userOptions.autoStartup).to.be.true;
				})
		});

		it('should set an user value to the autoStartup option', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: Object.assign({}, WPROOFREADER_CONFIG, { autoStartup: false })
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(wproofreader._userOptions.autoStartup).to.be.false;
				})
		});
	})

	describe('with badgeOffset options', () => {
		it('should set `11` pixels to the badgeOffset options', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(wproofreader._userOptions.badgeOffsetX).to.be.equal(11);
					expect(wproofreader._userOptions.badgeOffsetY).to.be.equal(11);
				})
		});

		it('should set user values to the badgeOffset options', () => {
			const badgeOffsetX = 12;
			const badgeOffsetY = 13;

			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: Object.assign({}, WPROOFREADER_CONFIG, { badgeOffsetX, badgeOffsetY })
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(wproofreader._userOptions.badgeOffsetX).to.be.equal(badgeOffsetX);
					expect(wproofreader._userOptions.badgeOffsetY).to.be.equal(badgeOffsetY);
				})
		});
	})

	describe('with fullSizeBadge option', () => {
		it('should avoid setting default badgeOffset options', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: Object.assign({}, WPROOFREADER_CONFIG, { fullSizeBadge: true })
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(wproofreader._userOptions.badgeOffsetX).to.be.undefined;
					expect(wproofreader._userOptions.badgeOffsetY).to.be.undefined;
				})
		});
	})

	describe('disable functionality', () => {
		it('should enable the plugin and instances because autoStartup option is enabled', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(wproofreader.isEnabled).to.be.true;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.false;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.false;
				})
		});

		it('should disable the plugin and instances because autoStartup option is disabled', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: Object.assign({}, WPROOFREADER_CONFIG, { autoStartup: false })
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(wproofreader.isEnabled).to.be.false;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.true;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.true;
				})
		});

		it('should disable the plugin and instances after the WProofreaderToggle command is disabled', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');
					const command = editor.commands.get('WProofreaderToggle');

					expect(command.isEnabled).to.be.true;
					expect(wproofreader.isEnabled).to.be.true;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.false;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.false;

					command.isEnabled = false;

					expect(command.isEnabled).to.be.false;
					expect(wproofreader.isEnabled).to.be.false;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.false;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.true;
					expect(wproofreader._instances[0].isDisabled()).to.be.true;
				})
		});

		it('should enable the plugin and instances after the WProofreaderToggle command is enabled', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');
					const command = editor.commands.get('WProofreaderToggle');

					command.isEnabled = false;

					expect(command.isEnabled).to.be.false;
					expect(wproofreader.isEnabled).to.be.false;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.false;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.true;
					expect(wproofreader._instances[0].isDisabled()).to.be.true;

					command.isEnabled = true;

					expect(command.isEnabled).to.be.true;
					expect(wproofreader.isEnabled).to.be.true;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.false;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.false;
				})
		});

		it('should disable the plugin and instances after the toggle command execution', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');
					const command = editor.commands.get('WProofreaderToggle');

					expect(wproofreader.isEnabled).to.be.true;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.false;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.false;

					command.execute();

					expect(wproofreader.isEnabled).to.be.false;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.true;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.true;
				})
		});

		it('should enable the plugin and instances after the toggle command execution', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');
					const command = editor.commands.get('WProofreaderToggle');

					command.execute();

					expect(wproofreader.isEnabled).to.be.false;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.true;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.true;

					command.execute();

					expect(wproofreader.isEnabled).to.be.true;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.false;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.false;
				})
		});

		it('should enable the plugin and instances after the toggle command execution when autoStartup option is disabled', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: Object.assign({}, WPROOFREADER_CONFIG, { autoStartup: false })
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');
					const command = editor.commands.get('WProofreaderToggle');

					expect(wproofreader.isEnabled).to.be.false;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.true;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.true;

					command.execute();

					expect(wproofreader.isEnabled).to.be.true;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.false;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.false;
				})
		});

		it('should disable the plugin and instances after the toggle command execution and the WProofreaderToggle command disabling', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');
					const command = editor.commands.get('WProofreaderToggle');

					expect(wproofreader.isEnabled).to.be.true;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.false;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.false;

					command.execute();

					expect(wproofreader.isEnabled).to.be.false;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.true;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.true;

					command.isEnabled = false;

					expect(wproofreader.isEnabled).to.be.false;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.true;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.true;
					expect(wproofreader._instances[0].isDisabled()).to.be.true;
				})
		});

		it('should enable the plugin and instances after the toggle command execution and the WProofreaderToggle command enabling', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');
					const command = editor.commands.get('WProofreaderToggle');

					command.execute();

					expect(wproofreader.isEnabled).to.be.false;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.true;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.true;

					command.isEnabled = false;

					expect(wproofreader.isEnabled).to.be.false;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.true;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.true;
					expect(wproofreader._instances[0].isDisabled()).to.be.true;

					command.isEnabled = true;

					expect(wproofreader.isEnabled).to.be.false;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.true;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.true;

					command.execute();

					expect(wproofreader.isEnabled).to.be.true;
					expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.false;
					expect(wproofreader._disableStack.has('WProofreaderToggleCommandDisabling')).to.be.false;
					expect(wproofreader._instances[0].isDisabled()).to.be.false;
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

	describe('in CKEditor 5 restricted editing mode', () => {
		it('should enable the restrictedEditingMode option of the WEBSPELLCHECKER because of RestrictedEditingMode plugin', () => {
			return ClassicEditor
				.create(element, {
					plugins: [WProofreader, RestrictedEditingMode],
					wproofreader: WPROOFREADER_CONFIG
				})
				.then((editor) => {
					const wproofreader = editor.plugins.get('WProofreader');

					expect(editor.plugins.has('RestrictedEditingMode')).to.be.true;
					expect(wproofreader._options.restrictedEditingMode).to.be.true;
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
						const setIsEnabledSpy = sinon.spy(wproofreader, '_setIsEnabled');
						const syncToggleSpy = sinon.spy(wproofreader, '_syncToggle');
						const spy = sinon.spy(wproofreader._instances[0], 'disable');

						wproofreader._instances[0].disable();

						expect(wproofreader._instances.length).to.be.equal(1);

						// Checks that the spy was called twice because it was called manually once.
						sinon.assert.calledTwice(spy);
						sinon.assert.calledOnce(setIsEnabledSpy);
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
						const setIsEnabledSpy = sinon.spy(wproofreader, '_setIsEnabled');
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

						sinon.assert.calledOnce(setIsEnabledSpy);
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
			it('should do nothing if WEBSPELLCHECKER instances are not ready', () => {
				const isInstancesEnabledSpy = sinon.spy(wproofreader, 'isInstancesEnabled');
				const setIsEnabledSpy = sinon.spy(wproofreader, '_setIsEnabled');
				const syncToggleSpy = sinon.spy(wproofreader, '_syncToggle');

				wproofreader._instances = [];

				wproofreader.toggle();

				sinon.assert.notCalled(isInstancesEnabledSpy);
				sinon.assert.notCalled(setIsEnabledSpy);
				sinon.assert.notCalled(syncToggleSpy);
			});

			it('should disable WEBSPELLCHECKER instances', () => {
				const spy = sinon.spy(wproofreader._instances[0], 'disable');
				const isInstancesEnabledSpy = sinon.spy(wproofreader, 'isInstancesEnabled');
				const setIsEnabledSpy = sinon.spy(wproofreader, '_setIsEnabled');
				const syncToggleSpy = sinon.spy(wproofreader, '_syncToggle');

				wproofreader.toggle();

				sinon.assert.calledOnce(spy);
				sinon.assert.calledOnce(isInstancesEnabledSpy);
				sinon.assert.calledOnce(setIsEnabledSpy);
				sinon.assert.calledOnce(syncToggleSpy);
				expect(wproofreader.isEnabled).to.be.false;
				expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.true;
			});

			it('should enable WEBSPELLCHECKER instances', () => {
				const spy = sinon.spy(wproofreader._instances[0], 'enable');
				const isInstancesEnabledSpy = sinon.spy(wproofreader, 'isInstancesEnabled');
				const setIsEnabledSpy = sinon.spy(wproofreader, '_setIsEnabled');
				const syncToggleSpy = sinon.spy(wproofreader, '_syncToggle');

				wproofreader._instances[0].disabled = true;

				wproofreader.toggle();

				sinon.assert.calledOnce(spy);
				sinon.assert.calledOnce(isInstancesEnabledSpy);
				sinon.assert.calledOnce(setIsEnabledSpy);
				sinon.assert.calledOnce(syncToggleSpy);
				expect(wproofreader.isEnabled).to.be.true;
				expect(wproofreader._disableStack.has('InstancesDisabling')).to.be.false;
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
