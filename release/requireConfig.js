require.config({
	paths: {
		'css': 'Prius.Web/Build/requirejs-plugins',
		'css-builder': 'Prius.Web/Build/requirejs-plugins',
		'normalize': 'Prius.Web/Build/requirejs-plugins',
		'noext': 'Prius.Web/Build/requirejs-plugins',
		'i18n': 'Prius.Web/Build/requirejs-plugins',
		'domReady': 'Prius.Web/Build/requirejs-plugins',

		'jquery': 'Prius.Web/Build/jquery',
		'jquery-ui': 'Prius.Web/Build/jquery',
		'jquery-ui/themes/smoothness': 'Prius.Web/Build/jquery',

		'bootstrap': 'Prius.Web/Build/bootstrap',
		'bootstrap/theme': 'Prius.Web/Build/bootstrap',

		'tinymce': 'Prius.Web/Build/tinymce',
		'tinymce/themes/modern': 'Prius.Web/Build/tinymce',
		'tinymce/skins/lightgray': 'Prius.Web/Build/tinymce',

		'elfinder': 'Prius.Web/Build/elfinder',
		'elfinder/theme': 'Prius.Web/Build/elfinder',
		'nls/elfinder': 'Prius.Web/Build/elfinder',
		'nls/ar/elfinder': 'Prius.Web/Build/elfinder',
		'nls/de/elfinder': 'Prius.Web/Build/elfinder',
		'nls/es/elfinder': 'Prius.Web/Build/elfinder',
		'nls/fr/elfinder': 'Prius.Web/Build/elfinder',
		'nls/ja/elfinder': 'Prius.Web/Build/elfinder',
		'nls/pt/elfinder': 'Prius.Web/Build/elfinder',
		'nls/ru/elfinder': 'Prius.Web/Build/elfinder',
		'nls/zh/elfinder': 'Prius.Web/Build/elfinder',
		'nls/it/elfinder': 'Prius.Web/Build/elfinder',
		'nls/ko/elfinder': 'Prius.Web/Build/elfinder'
	},

	map: {
		'*': {
			'jquery-ui/theme': 'jquery-ui/themes/smoothness',

			'tinymce/theme': 'tinymce/themes/modern',
			'tinymce/skin': 'tinymce/skins/lightgray'
		}
	}
});