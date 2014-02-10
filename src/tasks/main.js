(function(require) {
	require.config({
		shim: {
			'bootstrap-tabdrop': {
				deps: ['jquery']
			}
		},

		paths: {
			'css': 'tasks/components/require-css/css',
			'css-builder': 'tasks/components/require-css/css-builder',
			'normalize': 'tasks/components/require-css/normalize',
			'i18n': 'tasks/components/requirejs-i18n/i18n',
			'text': 'tasks/components/requirejs-text/text',

			'bootstrap-tabdrop': 'core/components/bootstrap-tabdrop/build/js/bootstrap-tabdrop.min',
			'bootstrap-tabdrop/css': 'core/components/bootstrap-tabdrop/build/css/tabdrop'
		}
	});
})(requirejs);