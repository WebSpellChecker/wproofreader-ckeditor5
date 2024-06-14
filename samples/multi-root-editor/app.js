import MultirootEditorBase from './multi-root-editor.js';

import {
	Essentials,
	Paragraph,
	Heading,
	List,
	Bold,
	Italic
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css'

import { WProofreader } from '../../dist/index.js';

export default class MultirootEditor extends MultirootEditorBase {}

MultirootEditor.builtinPlugins = [ Essentials, Paragraph, Heading, List, Bold, Italic, WProofreader ];
