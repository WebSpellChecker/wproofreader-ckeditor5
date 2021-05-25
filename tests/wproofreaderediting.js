import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import WProofreaderEditing from '../src/wproofreaderediting';
import WProofreaderToggleCommand from '../src/wproofreadertogglecommand';
import WProofreaderSettingsCommand from '../src/wproofreadersettingscommand';
import WProofreaderDialogCommand from '../src/wproofreaderdialogcommand';
import { TrackChanges } from './mocks/mock-track-changes-editing';

describe('WProofreaderEditing', () => {
	let element, wproofreaderEditing, trackChangesEditing, testEditor;

	beforeEach(() => {
		element = document.createElement('div');
		document.body.appendChild(element);

		return ClassicEditor
			.create(element, {
				plugins: [WProofreaderEditing, TrackChanges]
			})
			.then((editor) => {
				testEditor = editor;
				wproofreaderEditing = testEditor.plugins.get('WProofreaderEditing');
				trackChangesEditing = testEditor.plugins.get('TrackChangesEditing');
			});
	});

	afterEach(() => {
		element.remove();
		wproofreaderEditing = null;
		trackChangesEditing = null;

		return testEditor.destroy();
	});

	it('should be loaded', () => {
		expect(testEditor.plugins.has('WProofreaderEditing')).to.be.true;
		expect(wproofreaderEditing).to.be.instanceOf(WProofreaderEditing);
	});

	it('should add WProofreaderToggleCommand command', () => {
		expect(testEditor.commands.get('WProofreaderToggle')).to.be.instanceOf(WProofreaderToggleCommand);
	});

	it('should add WProofreaderSettingsCommand command', () => {
		expect(testEditor.commands.get('WProofreaderSettings')).to.be.instanceOf(WProofreaderSettingsCommand);
	});

	it('should add WProofreaderDialogCommand command', () => {
		expect(testEditor.commands.get('WProofreaderDialog')).to.be.instanceOf(WProofreaderDialogCommand);
	});

	it('should enable WProofreader commands in the Track Changes mode', () => {
		expect(trackChangesEditing.counter).to.be.equal(3);
	});
});
