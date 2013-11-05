﻿(function(require, define) {
	var getCookie = function(cookie) {
		var matches = cookie && cookie.length && document.cookie.match(new RegExp(
			"(?:^|; )" + cookie.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));

		return matches ? decodeURIComponent(matches[1]) : undefined;
	};

	var locale = getCookie('currentLocale') || window.navigator.userLanguage ||
		window.navigator.language || 'en';

	require.config({
		baseUrl: '../',
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
				deps: ['jquery', 'css!bootstrap/datepicker/theme']
			},

			'angular': {
				exports: 'angular',
				deps: ['jquery']
			},
			'nls/en/angular': {
				deps: ['angular']
			},
			'nls/ru/angular': {
				deps: ['angular']
			},

			'angular-ui-router': {
				deps: ['angular'],
				init: function () { return this.angular.module('ui.router'); }
			},
			'angular-ui-bootstrap3': {
				deps: ['angular'],
				init: function () { return this.angular.module('ui.bootstrap'); }
			},
			'angular-ui-select2': {
				deps: ['angular', 'jquery', 'jquery/select2'],
				init: function () { return this.angular.module('ui.select2'); }
			},
			'angular-promise-tracker': {
				deps: ['angular'],
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
			'bootstrap/datepicker/theme': 'components/eternicode-bootstrap-datepicker/bootstrap-datepicker/css/datepicker',

			'angular': 'components/angular/angular',
			'nls/en/angular': 'components/angular-i18n/angular-locale_en',
			'nls/ru/angular': 'components/angular-i18n/angular-locale_ru',
			'angular-ui-bootstrap3': 'components/angular-ui-bootstrap3/dist/ui-bootstrap-tpls-0.6.0-SNAPSHOT',
			'angular-ui-router': 'components/angular-ui-router/release/angular-ui-router',
			'angular-ui-select2': 'components/angular-ui-select2/src/select2',
			'angular-promise-tracker': 'components/angular-promise-tracker/promise-tracker',

			'ago': 'src'
		},

		config: {
			i18n: {
				locale: locale
			},
			'ago/core/module': {
				sysConfig: {
					modules: {},
					project: "prj1",
					lang: locale,
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