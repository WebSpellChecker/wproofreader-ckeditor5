import MultirootEditor from './multi-root-editor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import WProofreader from '../../src/wproofreader';

MultirootEditor
	.create(
		{
			header: document.querySelector('#header'),
			content: document.querySelector('#content'),
			footerleft: document.querySelector('#footer-left'),
			footerright: document.querySelector('#footer-right')
		},
		{
			plugins: [Essentials, Paragraph, Heading, List, Bold, Italic, WProofreader],
			toolbar: ['heading', 'bold', 'italic', 'numberedList', 'bulletedList', 'wproofreader'],
			placeholder: {
				header: 'Header text goes here',
				content: 'Type content here',
				footerleft: 'Left footer content',
				footerright: 'Right footer content'
			},
			wproofreader: {
				serviceProtocol: 'http',
				serviceHost: 'localhost',
				servicePort: '2880',
				servicePath: '/',
				srcUrl: 'https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js'
			}
		}
	)
	.then(newEditor => {
		document.querySelector('#toolbar').appendChild(newEditor.ui.view.toolbar.element);

		window.editor = newEditor;
	})
	.catch(err => {
		console.error(err.stack);
	});
