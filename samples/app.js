import ClassicEditor from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

ClassicEditor
	.create(document.querySelector('#editor'))
	.then(editor => {
		console.log('Editor was initialized', editor);

		window.editor = editor;
	})
	.catch(error => {
		console.error(error);
	});
