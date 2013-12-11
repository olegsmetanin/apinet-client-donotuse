(function(require) {
	require.config({
		config: {
			'core/services/apinetService': {
				apiRoot: 'http://localhost:36651/api/'
			}
		}
	});
})(requirejs);