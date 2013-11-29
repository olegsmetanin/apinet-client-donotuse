require.config({
	waitSeconds: 15,
	paths: {
		'jquery': 'release/jquery',
		'jquery-migrate': 'release/jquery',
		'jquery-ui': 'release/jquery',
		'jquery-ui/themes/smoothness': 'release/jquery',
		'jquery/select2': 'release/jquery',
		'jquery/select2/theme': 'release/jquery',

		'css': 'release/components',
		'css-builder': 'release/components',
		'normalize': 'release/components',
		'i18n': 'release/components',
		'domReady': 'release/components',
		'text': 'release/components',

		'modernizr': 'release/components',
		'retina': 'release/components',

		'bootstrap': 'release/components',
		'bootstrap/theme': 'release/components',
		'bootstrap/datepicker':	'release/components',
		'nls/bootstrap_datepicker': 'release/components',
		'nls/ru/bootstrap_datepicker': 'release/components.ru',
		'bootstrap/datepicker/theme': 'release/components',

		'angular': 'release/components',
		'nls/angular': 'release/components',
		'nls/en/angular': 'release/components.en',
		'nls/ru/angular': 'release/components.ru',
		'angular-ui-bootstrap3': 'release/components',
		'angular-ui-router': 'release/components',
		'angular-ui-select2': 'release/components',
		'angular-promise-tracker': 'release/components',

		'ago': 'release'
	},

	map: {
		'*': {
			'ago/components/flatty/light-theme': 'ago/components/flatty/light-theme-embedded'
		}
	}
});