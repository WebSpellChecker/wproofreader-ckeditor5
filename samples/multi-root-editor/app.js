import MultirootEditorBase from './multi-root-editor.js';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { List } from '@ckeditor/ckeditor5-list';
import { Bold } from '@ckeditor/ckeditor5-basic-styles';
import { Italic } from '@ckeditor/ckeditor5-basic-styles';

import WProofreader from '../../src/wproofreader.js';

export default class MultirootEditor extends MultirootEditorBase {}

MultirootEditor.builtinPlugins = [Essentials, Paragraph, Heading, List, Bold, Italic, WProofreader];
