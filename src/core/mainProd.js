require.config({
	paths: {
		'css': 'core/components/require-css/css',
		'css-builder': 'core/components/require-css/css-builder',
		'normalize': 'core/components/require-css/normalize',
		'domReady': 'core/components/requirejs-domready/domReady',

		'jquery': 'core/components/jquery/jquery',
		'angular': 'core/module',
		'jquery-ui': 'core/module',

		'core/nls/ru/bootstrap_datepicker': 'core/module.ru',

		'core/nls/en/angular': 'core/module.en',
		'core/nls/ru/angular': 'core/module.ru',

		'core/nls/en/module': 'core/module.en',
		'core/nls/ru/module': 'core/module.ru'
	}
});

require(['jquery', 'angular', 'domReady!'], function ($, angular) {
	require(['core/module'], function (module) {
		angular.bootstrap($('body'), [module.name]);
	});
});