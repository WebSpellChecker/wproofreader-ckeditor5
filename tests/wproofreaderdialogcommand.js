import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Command from '@ckeditor/ckeditor5-core/src/command.js';
import WProofreader from '../src/wproofreader.js';
import WProofreaderDialogCommand from '../src/wproofreaderdialogcommand.js';

describe('WProofreaderSettingsCommand', () => {
	const WPROOFREADER_CONFIG = {
		serviceProtocol: 'http',
		serviceHost: 'localhost',
		servicePort: '2880',
		servicePath: '/',
		srcUrl: 'http://localhost:3000/tests/mocks/mock-wscbundle.js'
	};

	let element, testEditor, wproofreader, wproofreaderDialog;

	beforeEach(() => {
		element = document.createElement('div');
		document.body.appendChild(element);

		return ClassicEditor
			.create(element, {
				plugins: [WProofreader],
				wproofreader: WPROOFREADER_CONFIG
			})
			.then((editor) => {
				testEditor = editor;
				wproofreader = testEditor.plugins.get('WProofreader');
				wproofreaderDialog = testEditor.commands.get('WProofreaderDialog');
			});
	});

	afterEach(() => {
		element.remove();
		wproofreader = null;
		wproofreaderDialog = null;

		return testEditor.destroy();
	});

	it('should be a command', () => {
		expect(WProofreaderDialogCommand.prototype).to.be.instanceOf(Command);
		expect(wproofreaderDialog).to.be.instanceOf(Command);
	});

	it('should open the WEBSPELLCHECKER dialog', () => {
		const spy = sinon.spy(wproofreader, 'openDialog');

		testEditor.execute('WProofreaderDialog');

		sinon.assert.calledOnce(spy);
	});
});
