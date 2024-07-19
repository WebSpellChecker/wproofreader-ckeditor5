import { Plugin } from '@ckeditor/ckeditor5-core';

export class WProofreader extends Plugin {}

declare module '@ckeditor/ckeditor5-core' {
	interface EditorConfig {
		wproofreader?: Object;
	}
}
