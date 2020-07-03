WProofreader plugin for CKEditor 5
===================================

The ultimate spelling and grammar checking tool for your web app. It provides both instant and in a dialog proofreading modes in a convenient UI.
This package implements proofreader support for CKEditor 5.

## Table of contents

* [Install instructions](#install-instructions)
* [Documentation](#documentation)

## Install instructions

1. Install the npm module:

	```
	npm install wproofreader-ckeditor5
	```

2. Update the application for the CKEditor by adding the new plugin and a configration for it:

	```js
	import WProofreader from 'wproofreader-ckeditor5';
	...

	ClassicEditor
		.create( editorElement, {
			plugins: [ ..., WProofreader],
			wproofreader: {
				serviceProtocol: 'https',
				serviceHost: 'localhost',
				servicePort: '2880',
				servicePath: '/',
				srcUrl: 'https://svc.webspellchecker.net/spellcheck31/wscbundle/wscbundle.js'
			}
		})
   ```

Set all the Proofreader configuration data into the `wproofreader` field of the CKEditor config. `srcUrl` option is for a path to the `wscbundle.js` file.

## Documentation

To find out more see the following documentation:

* [API documentation](https://webspellchecker.com/docs/api/wscbundle/Options.html)
* [CKEditor 5 Framework documentation](https://ckeditor.com/docs/ckeditor5/latest/framework/index.html)
