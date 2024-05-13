import { Plugin } from '@ckeditor/ckeditor5-core';

declare module '@webspellchecker/wproofreader-ckeditor5/src/wproofreader' {
	export default class WProofreader extends Plugin {}
}
declare module '@ckeditor/ckeditor5-core' {
	interface EditorConfig {
		wproofreader?: Object;
	}
}
