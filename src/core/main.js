require.config({
	shim: {
		'jquery-migrate': {
			deps: ['jquery'],
			init: function (jQuery) {
				jQuery.migrateMute = true;
			}
		},
		'jquery-ui': {
			deps: ['jquery']
		},
		'jquery/select2': {
			deps: ['jquery']
		},

		'bootstrap': {
			deps: ['jquery']
		},

		'bootstrap/datepicker': {
			deps: ['jquery']
		},

		'easyXDM': {
			exports: 'easyXDM'
		},

		'jquery.iframe-transport': {
			deps: ['jquery']
		},

		'jquery.fileupload': {
			deps: ['jquery']
		},

		'jquery.fileupload-image': {
			deps: ['jquery']
		},

		'jquery.fileupload-audio': {
			deps: ['jquery']
		},

		'jquery.fileupload-video': {
			deps: ['jquery']
		},

		'jquery.fileupload-validate': {
			deps: ['jquery']
		},

		'jquery.fileupload-process': {
			deps: ['jquery']
		},

		'jquery.ui.widget': {
			deps: ['jquery']
		},

		'angular': {
			exports: 'angular',
			deps: [
				'jquery', 'jquery-ui', 'jquery/select2', 'bootstrap', 'bootstrap/datepicker', 'jquery-bridget',
				'imagesloaded', 'masonry', 'load-image', 'jquery.iframe-transport', 'jquery.fileupload',
				'jquery.fileupload-image', 'jquery.fileupload-audio', 'jquery.fileupload-video', 'jquery.fileupload-validate',
				'jquery.fileupload-process', 'jquery.ui.widget'
			]
		},

		'core/nls/en/angular': {
			deps: ['jquery', 'angular'],
			init: function () {
				return this.angular.module('ngLocale');
			}
		},
		'core/nls/ru/angular': {
			deps: ['jquery', 'angular'],
			init: function () {
				return this.angular.module('ngLocale');
			}
		},
		'angular-resource': {
			deps: ['jquery', 'angular'],
			init: function () {
				return this.angular.module('ngResource');
			}
		},
		'angular-ui-router': {
			deps: ['jquery', 'angular'],
			init: function () {
				return this.angular.module('ui.router');
			}
		},
		'angular-ui-bootstrap3': {
			deps: ['jquery', 'angular', 'bootstrap'],
			init: function () {
				return this.angular.module('ui.bootstrap');
			}
		},
		'angular-promise-tracker': {
			deps: ['jquery', 'jquery-bridget', 'imagesloaded', 'masonry', 'angular'],
			init: function () {
				return this.angular.module('ajoslin.promise-tracker');
			}
		},
		'angular-masonry': {
			deps: ['jquery', 'masonry', 'angular'],
			init: function () {
				return this.angular.module('wu.masonry');
			}
		},

		'socket.io-client': {
			exports: 'socket.io-client'
		}
	},

	paths: {
		'css': 'core/components/require-css/css',
		'css-builder': 'core/components/require-css/css-builder',
		'normalize': 'core/components/require-css/normalize',
		'i18n': 'core/components/requirejs-i18n/i18n',
		'text': 'core/components/requirejs-text/text',

		'jquery': 'core/components/jquery/jquery',
		'jquery-bridget': 'core/components/jquery-bridget/jquery.bridget',
		'jquery-migrate': 'core/components/jquery/jquery-migrate',
		'jquery-ui': 'core/components/jquery-ui/ui/jquery-ui',
		'jquery/select2': 'core/components/select2/select2',
		'jquery/select2/theme': 'core/components/select2/select2',
		'jquery.iframe-transport': 'core/components/blueimp-file-upload/js/jquery.iframe-transport',
		'jquery.fileupload': 'core/components/blueimp-file-upload/js/jquery.fileupload',
		'jquery.fileupload-image': 'core/components/blueimp-file-upload/js/jquery.fileupload-image',
		'jquery.fileupload-audio': 'core/components/blueimp-file-upload/js/jquery.fileupload-audio',
		'jquery.fileupload-video': 'core/components/blueimp-file-upload/js/jquery.fileupload-video',
		'jquery.fileupload-validate': 'core/components/blueimp-file-upload/js/jquery.fileupload-validate',
		'jquery.fileupload-process': 'core/components/blueimp-file-upload/js/jquery.fileupload-process',
		'jquery.ui.widget': 'core/components/blueimp-file-upload/js/vendor/jquery.ui.widget',
		'load-image': 'core/components/blueimp-load-image/js/load-image',
		'load-image-meta': 'core/components/blueimp-load-image/js/load-image-meta',
		'load-image-exif': 'core/components/blueimp-load-image/js/load-image-exif',
		'load-image-ios': 'core/components/blueimp-load-image/js/load-image-ios',
		'canvas-to-blob': 'core/components/blueimp-canvas-to-blob/js/canvas-to-blob',

		'bootstrap': 'core/components/bootstrap/dist/js/bootstrap',

		'easyXDM': 'core/components/easyXDM/easyXDM',

		'masonry': 'core/components/masonry/masonry',
		'outlayer': 'core/components/outlayer',
		'get-size': 'core/components/get-size',
		'imagesloaded': 'core/components/imagesloaded/imagesloaded',
		'get-style-property': 'core/components/get-style-property',
		'eventie': 'core/components/eventie',
		'doc-ready': 'core/components/doc-ready',
		'eventEmitter': 'core/components/eventEmitter',
		'matches-selector': 'core/components/matches-selector',

		'angular': 'core/components/angular/angular',
		'core/nls/en/angular': 'core/components/angular-i18n/angular-locale_en',
		'core/nls/ru/angular': 'core/components/angular-i18n/angular-locale_ru',
		'angular-animate': 'core/components/angular-animate/angular-animate.min',
		'angular-resource': 'core/components/angular-resource/angular-resource',
		'angular-ui-bootstrap3': 'core/components/angular-ui-bootstrap3/dist/ui-bootstrap-tpls-0.6.0-SNAPSHOT',
		'angular-ui-router': 'core/components/angular-ui-router/release/angular-ui-router',
		'angular-ui-select2': 'core/components/angular-ui-select2/src/select2',
		'angular-promise-tracker': 'core/components/angular-promise-tracker/promise-tracker',
		'angular-masonry': 'core/components/angular-masonry/angular-masonry',
		'angular-uuid': 'core/components/angular-dragdrop/script/lvl-uuid',
		'lvl-dragdrop': 'core/directives/lvl-drag-drop',
		'blueimp-fileupload': 'core/wrapped-components/blueimp-file-upload/js/jquery.fileupload-angular',

		'socket.io-client': 'core/components/socket.io-client/dist/socket.io.min'
	}
});

require(['jquery'], function ($) {
	require(['angular', 'core/module', 'core/themes/flatty/theme'], function (angular, module) {
		$(document).ready(function () {
			angular.bootstrap($('body'), [module.name]);
		});
	});
});