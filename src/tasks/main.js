(function (require) {
	require.config({
		paths: {
			'css': 'tasks/components/require-css/css',
			'css-builder': 'tasks/components/require-css/css-builder',
			'normalize': 'tasks/components/require-css/normalize',
			'i18n': 'tasks/components/requirejs-i18n/i18n',
			'text': 'tasks/components/requirejs-text/text',

			'bootstrap-tabdrop': 'tasks/wrapped-components/bootstrap-tabdrop',
			'bootstrap-tabdrop/css': 'tasks/wrapped-components/bootstrap-tabdrop'
		}
	});
})(requirejs);