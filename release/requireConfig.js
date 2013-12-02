require.config({
	waitSeconds: 15,
	paths: {
		'css': 'release/components',
		'css-builder': 'release/components',
		'normalize': 'release/components',
		'i18n': 'release/components',
		'domReady': 'release/components',
		'text': 'release/components',
		'modernizr': 'release/components',
		'retina': 'release/components',

		'jquery': 'release/components/jquery-infrastructure',
		'jquery-migrate': 'release/jquery-infrastructure',
		'jquery-ui': 'release/jquery-infrastructure',
		'jquery-ui/themes/smoothness': 'release/jquery-infrastructure',
		'jquery/select2': 'components/jquery-infrastructure',
		'jquery/select2/theme': 'components/jquery-infrastructure',

		'bootstrap': 'release/components/bootstrap-infrastructure',
		'bootstrap/theme': 'release/components/bootstrap-infrastructure',
		'bootstrap/datepicker':	'release/components/bootstrap-infrastructure',
		'nls/bootstrap_datepicker': 'release/components/bootstrap-infrastructure',
		'nls/ru/bootstrap_datepicker': 'release/components/bootstrap-infrastructure.ru',
		'bootstrap/datepicker/theme': 'release/components/bootstrap-infrastructure',

		'angular': 'release/components/angular-infrastructure',
		'nls/angular': 'release/components/angular-infrastructure',
		'nls/en/angular': 'release/components/angular-infrastructure.en',
		'nls/ru/angular': 'release/components/angular-infrastructure.ru',
		'angular-ui-bootstrap3': 'release/components/angular-infrastructure',
		'angular-ui-router': 'release/components/angular-infrastructure',
		'angular-ui-select2': 'release/components/angular-infrastructure',
		'angular-promise-tracker': 'release/components/angular-infrastructure',

		'ago/core/nls/en/module': 'release/core/module.en',
		'ago/core/nls/ru/module': 'release/core/module.ru',
		'ago/home/nls/en/module': 'release/home/module.en',
		'ago/home/nls/ru/module': 'release/home/module.ru',
		'ago/tasks/nls/en/module': 'release/tasks/module.en',
		'ago/tasks/nls/ru/module': 'release/tasks/module.ru',
		'ago': 'release'
	}/*,

	map: {
		'*': {
			'ago/components/flatty/light-theme': 'ago/components/flatty/light-theme-embedded'
		}
	}*/
});