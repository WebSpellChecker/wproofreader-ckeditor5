import {
	ClassicEditor as ClassicEditorBase,
	Essentials,
	Paragraph,
	Heading,
	List,
	Bold,
	Italic
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css'

import { WProofreader } from '../dist/index.js';

export default class ClassicEditor extends ClassicEditorBase {}

ClassicEditor.builtinPlugins = [ Essentials, Paragraph, Heading, List, Bold, Italic, WProofreader ];
