define(['../moduleDef'], function (module) {
	module.service('coreConfig', ['$q', '$http', 'sysConfig',
		function($q, $http) {
			var service = {
				config: null,
				getConfig: function() {
					if (service.config) {
						return $q.when(service.config);
					} else {
						return $http.post('/api/core/config/getConfig').then(function(response) {
							service.config = response.data;
							return service.config;
						});
					}
				}

			};
			return service;
		}
	]);
});