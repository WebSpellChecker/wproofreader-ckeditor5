import {
	MultiRootEditor,
	Essentials,
	Paragraph,
	Heading,
	List,
	Bold,
	Italic,
	Image
} from 'ckeditor5';

import 'ckeditor5/ckeditor5.css'

import { WProofreader } from '../../dist/index.js';

export default class MultirootEditor extends MultiRootEditor {}

MultirootEditor.builtinPlugins = [ Essentials, Paragraph, Heading, List, Bold, Italic, Image,  WProofreader ];
