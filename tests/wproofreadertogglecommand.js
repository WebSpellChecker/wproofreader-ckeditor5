import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor.js';
import Command from '@ckeditor/ckeditor5-core/src/command.js';
import WProofreader from '../src/wproofreader.js';
import WProofreaderToggleCommand from '../src/wproofreadertogglecommand.js';

describe('WProofreaderToggleCommand', () => {
	const WPROOFREADER_CONFIG = {
		serviceProtocol: 'http',
		serviceHost: 'localhost',
		servicePort: '2880',
		servicePath: '/',
		srcUrl: 'http://localhost:3000/tests/mocks/mock-wscbundle.js'
	};

	let element, testEditor, wproofreader, wproofreaderToggle;

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
				wproofreaderToggle = testEditor.commands.get('WProofreaderToggle');
			});
	});

	afterEach(() => {
		element.remove();
		wproofreader = null;
		wproofreaderToggle = null;

		return testEditor.destroy();
	});

	it('should be a command', () => {
		expect(WProofreaderToggleCommand.prototype).to.be.instanceOf(Command);
		expect(wproofreaderToggle).to.be.instanceOf(Command);
	});

	it('should toggle WEBSPELLCHECKER instances', () => {
		const spy = sinon.spy(wproofreader, 'toggle');

		testEditor.execute('WProofreaderToggle');

		sinon.assert.calledOnce(spy);
	});
});
