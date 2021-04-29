import MultirootEditorBase from './multi-root-editor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import WProofreader from '../../src/wproofreader';

export default class MultirootEditor extends MultirootEditorBase {};

MultirootEditor.builtinPlugins = [Essentials, Paragraph, Heading, List, Bold, Italic, WProofreader];
