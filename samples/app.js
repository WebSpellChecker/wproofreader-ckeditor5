import { ClassicEditor as ClassicEditorBase } from '@ckeditor/ckeditor5-editor-classic';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { List } from '@ckeditor/ckeditor5-list';
import { Bold } from '@ckeditor/ckeditor5-basic-styles';
import { Italic } from '@ckeditor/ckeditor5-basic-styles';
import WProofreader from '../src/wproofreader.js';

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [Essentials, Paragraph, Heading, List, Bold, Italic, WProofreader];
