import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';
import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import List from '@ckeditor/ckeditor5-list/src/list';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import WProofreader from '../src/wproofreader'

ClassicEditor
	.create(document.querySelector('#editor'), {
		plugins: [Essentials, Paragraph, Heading, List, Bold, Italic, WProofreader],
		toolbar: ['heading', 'bold', 'italic', 'numberedList', 'bulletedList'],
		wproofreader: {
			serviceProtocol: 'http',
			serviceHost: 'localhost',
			servicePort: '2880',
			servicePath: '/',
			srcUrl: 'https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js'
		}
	})
	.then(editor => {
		console.log('Editor was initialized', editor);

		window.editor = editor;
	})
	.catch(error => {
		console.error(error);
	});
