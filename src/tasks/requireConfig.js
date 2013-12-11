(function(require) {
	require.config({
		waitSeconds: 60,
		paths: {
			'css': 'tasks/components/require-css/css',
			'css-builder': 'tasks/components/require-css/css-builder',
			'normalize': 'tasks/components/require-css/normalize',
			'i18n': 'tasks/components/requirejs-i18n/i18n',
			'text': 'tasks/components/requirejs-text/text'
		}

	});
})(requirejs);