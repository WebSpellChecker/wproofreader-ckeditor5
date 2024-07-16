import { MultiRootEditor } from '@ckeditor/ckeditor5-editor-multi-root';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { List } from '@ckeditor/ckeditor5-list';
import { Bold } from '@ckeditor/ckeditor5-basic-styles';
import { Italic } from '@ckeditor/ckeditor5-basic-styles';
import { Image } from '@ckeditor/ckeditor5-image';

import 'ckeditor5/ckeditor5.css'

import { WProofreader } from '../../src/index.js';

export default class MultirootEditor extends MultiRootEditor {}

MultirootEditor.builtinPlugins = [ Essentials, Paragraph, Heading, List, Bold, Italic, Image,  WProofreader ];
