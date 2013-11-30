require.config({
	waitSeconds: 15,
	shim: {
		'jquery/select2': {
			deps: ['jquery', 'css!jquery/select2/theme']
		}
	},
	paths: {
		'css': 'release/components',
		'css-builder': 'release/components',
		'normalize': 'release/components',
		'i18n': 'release/components',
		'domReady': 'release/components',
		'text': 'release/components',

		'modernizr': 'release/components',
		'retina': 'release/components',

		'jquery': 'release/components',
		'jquery-migrate': 'release/components',
		'jquery-ui': 'release/components',
		'jquery-ui/themes/smoothness': 'release/components',
		'jquery/select2': 'components/select2/select2',
		'jquery/select2/theme': 'components/select2/select2',

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