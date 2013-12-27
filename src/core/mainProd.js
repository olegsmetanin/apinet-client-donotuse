require.config({
	paths: {
		'css': 'core/module',
		'domReady': 'core/module',

		'jquery': 'core/module',
		'angular': 'core/module',
		'jquery-ui': 'core/module',

		'core/nls/ru/bootstrap_datepicker': 'core/module.ru',

		'core/nls/en/angular': 'core/module.en',
		'core/nls/ru/angular': 'core/module.ru',

		'core/nls/en/module': 'core/module.en',
		'core/nls/ru/module': 'core/module.ru'
	}
});

require(['jquery-ui', 'angular', 'domReady!'], function ($, angular) {
	require(['core/module','core/themes/flatty/theme'], function (module) {
		angular.bootstrap($('body'), [module.name]);
	});
});