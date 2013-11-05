(function(require, define) {
	require.config({
		shim: {
			'jquery-migrate': {
				deps: ['jquery']
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
			'bootstrap/plugins/tabdrop': {
				deps: ['jquery']
			},

			'angular': {
				exports: 'angular',
				deps: ['jquery']
			},
			'angular-ui-router': {
				deps: ['angular'],
				init: function () { return this.angular.module('ui.router'); }
			},
			'angular-ui-bootstrap3': {
				deps: ['angular'],
				init: function () { return this.angular.module('ui.bootstrap'); }
			},
			'nls/en/angular': {
				deps: ['angular']
			},
			'nls/ru/angular': {
				deps: ['angular']
			}
		},

		paths: {
			'css': 'components/require-css/css',
			'css-builder': 'components/require-css/css-builder',
			'normalize': 'components/require-css/normalize',
			'i18n': 'components/requirejs-i18n/i18n',
			'domReady': 'components/requirejs-domready/domReady',
			'text': 'components/requirejs-text/text',

			'jquery': 'components/jquery/jquery',
			'jquery-migrate': 'components/jquery/jquery-migrate',
			'jquery-ui': 'components/jquery-ui/ui/jquery-ui',
			'jquery-ui/themes/smoothness': 'components/jquery-ui/themes/smoothness/jquery-ui',
			'jquery/select2': 'components/select2-3.4.1/select2',
			'jquery/select2/theme': 'components/select2-3.4.1/select2',

			'bootstrap': 'components/bootstrap/dist/js/bootstrap',
			'bootstrap/theme': 'components/bootstrap/dist/css/bootstrap',
			'bootstrap/plugins/tabdrop': 'src/components/flatty/javascripts/plugins/tabdrop/bootstrap-tabdrop',

			'angular': 'components/angular-unstable/angular',
			'angular-ui-bootstrap3': 'components/angular-ui-bootstrap-fork/dist/ui-bootstrap-tpls-0.6.0-SNAPSHOT',
			'angular-ui-router': 'components/angular-ui-router/release/angular-ui-router',
			'nls/en/angular': 'components/angular-i18n/angular-locale_en',
			'nls/ru/angular': 'components/angular-i18n/angular-locale_ru',

			'ago': 'src'
		},

		config: {
			'ago/core/module': {
				sysConfig: {
					modules: {},
					project: "prj1",
					lang: 'ru',
					// use fake backend
					fakeBackend: true,
					// make dalay in milliseconds before $http requests when use fake backend
					delay: 0,
					supportedLocales: ['ru', 'en']
				}
			},
			'ago/core/services/apinetService': {
				apiRoot: 'http://localhost:36651/api/'
			}
		}
	});

	define('nls/angular', {
		'en': true,
		'ru': true
	});
})(requirejs, define);