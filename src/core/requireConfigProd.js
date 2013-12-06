require.config({
	waitSeconds: 15,
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