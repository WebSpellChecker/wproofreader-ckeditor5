import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import DropdownView from '@ckeditor/ckeditor5-ui/src/dropdown/dropdownview';
import ListView from '@ckeditor/ckeditor5-ui/src/list/listview';
import WProofreader from '../src/wproofreader';
import WProofreaderUI from '../src/wproofreaderui';
import wproofreaderIcon from '../theme/icons/wproofreader.svg';

describe('WProofreaderUI', () => {
	const WPROOFREADER_CONFIG = {
		serviceProtocol: 'http',
		serviceHost: 'localhost',
		servicePort: '2880',
		servicePath: '/',
		srcUrl: 'http://localhost:3000/tests/mocks/mock-wscbundle.js'
	};

	let element, wproofreader, wproofreaderUI, testEditor, command;

	beforeEach(() => {
		element = document.createElement('div');
		document.body.appendChild(element);

		return ClassicEditor
			.create(element, {
				plugins: [WProofreader],
				toolbar: ['wproofreader'],
				wproofreader: WPROOFREADER_CONFIG
			})
			.then((editor) => {
				testEditor = editor;
				wproofreader = testEditor.plugins.get('WProofreader');
				wproofreaderUI = testEditor.plugins.get('WProofreaderUI');
				command = testEditor.commands.get('WProofreaderToggle');
			});
	});

	afterEach(() => {
		element.remove();
		wproofreader = null;
		wproofreaderUI = null;
		command = null;

		return testEditor.destroy();
	});

	it('should be loaded', () => {
		expect(testEditor.plugins.has('WProofreaderUI')).to.be.true;
		expect(wproofreaderUI).to.be.instanceOf(WProofreaderUI);
	});

	describe('wproofreader dropdown', () => {
		let dropdown;

		beforeEach(() => {
			dropdown = testEditor.ui.componentFactory.create('wproofreader');
		});

		afterEach(() => {
			dropdown.destroy();
		});

		it('should be registered', () => {
			expect(dropdown).to.be.instanceOf(DropdownView);
		});

		describe('buttonView', () => {
			it('should have basic properties', () => {
				expect(dropdown.buttonView.label).to.equal('WProofreader text checker');
				expect(dropdown.buttonView.icon).to.equal(wproofreaderIcon);
				expect(dropdown.buttonView.tooltip).to.be.true;
			});
		});

		describe('panelView', () => {
			beforeEach(() => {
				dropdown.isOpen = true; // Dropdown is lazy loaded, so needs to be open to be verified (#6175).
			});

			it('should have a navigation view', () => {
				expect(dropdown.panelView.children.first).to.be.instanceOf(ListView);
			});

			it('should have navigation items', () => {
				const items = Array.from(dropdown.panelView.children.first.items);
				const labels = ['Disable', 'Settings', 'Proofread in dialog'];

				expect(items.length).to.equal(3);

				items.forEach((item, index) => {
					expect(item.children.first.label).to.equal(labels[index]);
				});
			});
		});

		describe('adding custom CSS classes for different cases', () => {
			describe('for the root element', () => {
				it('should hide dropdown items in case when WEBSPELLCHECKER instances are not ready', () => {
					wproofreader.isInstancesReady = function () { return false };

					dropdown.isOpen = true;
					dropdown.render();

					expect(dropdown.element.classList.contains('ck-wproofreader-empty')).to.be.true;
				});

				it('should not hide dropdown items in case when WEBSPELLCHECKER instances are ready', () => {
					dropdown.isOpen = true;
					dropdown.render();

					expect(dropdown.element.classList.contains('ck-wproofreader-empty')).to.be.false;
				});
			});

			describe('for navigation items', () => {
				it('should hide navigation items excluding toggle in case when WEBSPELLCHECKER instances are disabled', () => {
					let items, toggle, settings, dialog;

					wproofreader.isInstancesEnabled = function() { return false };
					dropdown.isOpen = true;
					dropdown.render();

					items = Array.from(dropdown.panelView.children.first.items);
					toggle = items[0].children.first.element;
					settings = items[1].children.first.element;
					dialog = items[2].children.first.element;

					expect(toggle.classList.contains('ck-hidden')).to.be.false;
					expect(settings.classList.contains('ck-hidden')).to.be.true;
					expect(dialog.classList.contains('ck-hidden')).to.be.true;
				});

				it('should not hide navigation items in case when WEBSPELLCHECKER instances are enabled', () => {
					let items, toggle, settings, dialog;

					dropdown.isOpen = true;
					dropdown.render();

					items = Array.from(dropdown.panelView.children.first.items);
					toggle = items[0].children.first.element;
					settings = items[1].children.first.element;
					dialog = items[2].children.first.element;

					expect(toggle.classList.contains('ck-hidden')).to.be.false;
					expect(settings.classList.contains('ck-hidden')).to.be.false;
					expect(dialog.classList.contains('ck-hidden')).to.be.false;
				});
			});
		});

		describe('commands executing', () => {
			it('should execute the WProofreaderToggle command', () => {
				const spy = sinon.spy(testEditor, 'execute');

				dropdown.commandParam = 'WProofreaderToggle';
				dropdown.fire('execute');

				sinon.assert.calledOnce(spy);
				sinon.assert.calledWithExactly(spy, 'WProofreaderToggle');
			});

			it('should execute the WProofreaderSettings command', () => {
				const spy = sinon.spy(testEditor, 'execute');

				dropdown.commandParam = 'WProofreaderSettings';
				dropdown.fire('execute');

				sinon.assert.calledOnce(spy);
				sinon.assert.calledWithExactly(spy, 'WProofreaderSettings');
			});

			it('should execute the WProofreaderDialog command', () => {
				const spy = sinon.spy(testEditor, 'execute');

				dropdown.commandParam = 'WProofreaderDialog';
				dropdown.fire('execute');

				sinon.assert.calledOnce(spy);
				sinon.assert.calledWithExactly(spy, 'WProofreaderDialog');
			});
		});

		describe('isEnabled functionality', () => {
			it('should have isEnabled bound to the WProofreaderToggle command\'s isEnabled', () => {
				command.isEnabled = true;
				expect(dropdown).to.have.property('isEnabled', true);

				command.isEnabled = false;
				expect(dropdown).to.have.property('isEnabled', false);
			});
		});
	});
});
