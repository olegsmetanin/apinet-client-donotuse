(function(require) {
	require.config({
		waitSeconds: 60,
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
			'i18n': 'core/components/requirejs-i18n/i18n',
			'domReady': 'core/components/requirejs-domready/domReady',
			'text': 'core/components/requirejs-text/text',

			'jquery': 'core/components/jquery/jquery',
			'jquery-migrate': 'core/components/jquery/jquery-migrate',
			'jquery-ui': 'core/components/jquery-ui/ui/jquery-ui',
			'jquery/select2': 'core/components/select2/select2',
			'jquery/select2/theme': 'core/components/select2/select2',

			'bootstrap': 'core/components/bootstrap/dist/js/bootstrap',
			'bootstrap/datepicker':	'core/components/eternicode-bootstrap-datepicker/bootstrap-datepicker/js/bootstrap-datepicker',
			'core/nls/ru/bootstrap_datepicker':	'core/components/eternicode-bootstrap-datepicker/bootstrap-datepicker/js/locales/bootstrap-datepicker.ru',
			'bootstrap/datepicker/theme': 'core/components/eternicode-bootstrap-datepicker/bootstrap-datepicker/css/datepicker',

			'angular': 'core/components/angular/angular',
			'core/nls/en/angular': 'core/components/angular-i18n/angular-locale_en',
			'core/nls/ru/angular': 'core/components/angular-i18n/angular-locale_ru',
			'angular-ui-bootstrap3': 'core/components/angular-ui-bootstrap3/dist/ui-bootstrap-tpls-0.6.0-SNAPSHOT',
			'angular-ui-router': 'core/components/angular-ui-router/release/angular-ui-router',
			'angular-ui-select2': 'core/components/angular-ui-select2/src/select2',
			'angular-promise-tracker': 'core/components/angular-promise-tracker/promise-tracker'
		}
	});
})(requirejs);