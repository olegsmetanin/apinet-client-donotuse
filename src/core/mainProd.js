require.config({
	shim: {
		'jquery-migrate': {
			deps: ['jquery'],
			init: function(jQuery) { jQuery.migrateMute = true; }
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
			deps: ['jquery', 'jquery-ui']
		},
		'nls/ru/bootstrap_datepicker': {
			deps: ['jquery', 'jquery-ui', 'bootstrap/datepicker']
		},

		'angular': {
			exports: 'angular',
			deps: ['jquery']
		},
		'nls/en/angular': {
			deps: ['jquery', 'angular'],
			init: function () { return this.angular.module('ngLocale'); }
		},
		'nls/ru/angular': {
			deps: ['jquery', 'angular'],
			init: function () { return this.angular.module('ngLocale'); }
		},
		'angular-ui-router': {
			deps: ['jquery', 'angular'],
			init: function () { return this.angular.module('ui.router'); }
		},
		'angular-ui-bootstrap3': {
			deps: ['jquery', 'angular', 'bootstrap'],
			init: function () { return this.angular.module('ui.bootstrap'); }
		},
		'angular-promise-tracker': {
			deps: ['jquery', 'angular'],
			init: function () { return this.angular.module('ajoslin.promise-tracker'); }
		}
	},

	paths: {
		'css': 'core/components/require-css/css',
		'css-builder': 'core/components/require-css/css-builder',
		'normalize': 'core/components/require-css/normalize',
		'domReady': 'core/module',

		'jquery': 'core/components/jquery/jquery',
		'angular': 'core/module',

		'core/nls/ru/bootstrap_datepicker': 'core/module.ru',

		'core/nls/en/angular': 'core/module.en',
		'core/nls/ru/angular': 'core/module.ru',

		'core/nls/en/module': 'core/module.en',
		'core/nls/ru/module': 'core/module.ru'
	}
});

require(['jquery', 'angular', 'core/module', 'domReady!'], function ($, angular, module) {
	angular.bootstrap($('body'), [module.name]);
});