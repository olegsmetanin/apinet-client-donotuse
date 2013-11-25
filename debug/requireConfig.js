(function(require, define) {
	require.config({
		baseUrl: '../',
		waitSeconds: 60,
		shim: {
			'modernizr': {
				exports: 'Modernizr'
			},
			'retina': {
				exports: 'Retina'
			},
			'jquery-migrate': {
				deps: ['jquery'],
				init: function(jQuery) { jQuery.migrateMute = true; }
			},
			'jquery-ui': {
				deps: ['jquery']
			},
			'jquery/select2': {
				deps: ['jquery', 'css!jquery/select2/theme']
			},

			'bootstrap': {
				deps: ['jquery']
			},
			'bootstrap/datepicker': {
				deps: ['jquery', 'jquery-ui', 'css!bootstrap/datepicker/theme']
			},
			'nls/ru/bootstrap_datepicker': {
				deps: ['jquery', 'jquery-ui', 'bootstrap/datepicker']
			},

			'angular': {
				exports: 'angular',
				deps: ['jquery']
			},
			'nls/en/angular': {
				deps: ['jquery', 'angular']
			},
			'nls/ru/angular': {
				deps: ['jquery', 'angular']
			},

			'angular-ui-router': {
				deps: ['jquery', 'angular'],
				init: function () { return this.angular.module('ui.router'); }
			},
			'angular-ui-bootstrap3': {
				deps: ['jquery', 'angular'],
				init: function () { return this.angular.module('ui.bootstrap'); }
			},
			'angular-ui-select2': {
				deps: ['jquery', 'angular', 'jquery/select2'],
				init: function () { return this.angular.module('ui.select2'); }
			},
			'angular-promise-tracker': {
				deps: ['jquery', 'angular'],
				init: function () { return this.angular.module('ajoslin.promise-tracker'); }
			}
		},

		paths: {
			'css': 'components/require-css/css',
			'css-builder': 'components/require-css/css-builder',
			'normalize': 'components/require-css/normalize',
			'i18n': 'components/requirejs-i18n/i18n',
			'domReady': 'components/requirejs-domready/domReady',
			'text': 'components/requirejs-text/text',

			'modernizr': 'components/modernizr/modernizr',
			'retina': 'components/retina.js/src/retina',

			'jquery': 'components/jquery/jquery',
			'jquery-migrate': 'components/jquery/jquery-migrate',
			'jquery-ui': 'components/jquery-ui/ui/jquery-ui',
			'jquery-ui/themes/smoothness': 'components/jquery-ui/themes/smoothness/jquery-ui',
			'jquery/select2': 'components/select2/select2',
			'jquery/select2/theme': 'components/select2/select2',

			'bootstrap': 'components/bootstrap/dist/js/bootstrap',
			'bootstrap/theme': 'components/bootstrap/dist/css/bootstrap',
			'bootstrap/datepicker':	'components/eternicode-bootstrap-datepicker/bootstrap-datepicker/js/bootstrap-datepicker',
			'nls/ru/bootstrap_datepicker':	'components/eternicode-bootstrap-datepicker/bootstrap-datepicker/js/locales/bootstrap-datepicker.ru',
			'bootstrap/datepicker/theme': 'components/eternicode-bootstrap-datepicker/bootstrap-datepicker/css/datepicker',

			'angular': 'components/angular/angular',
			'nls/en/angular': 'components/angular-i18n/angular-locale_en',
			'nls/ru/angular': 'components/angular-i18n/angular-locale_ru',
			'angular-ui-bootstrap3': 'components/angular-ui-bootstrap3/dist/ui-bootstrap-tpls-0.6.0-SNAPSHOT',
			'angular-ui-router': 'components/angular-ui-router/release/angular-ui-router',
			'angular-ui-select2': 'components/angular-ui-select2/src/select2',
			'angular-promise-tracker': 'components/angular-promise-tracker/promise-tracker',

			'ago': 'src'
		}
	});

	define('nls/angular', {
		'en': true,
		'ru': true
	});

	define('nls/bootstrap_datepicker', {
		'ru': true
	});
})(requirejs, define);