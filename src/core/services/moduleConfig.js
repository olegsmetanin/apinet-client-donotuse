angular.module('core')
	.service("moduleConfig", ['$q', '$http', 'sysConfig',
		function($q, $http, sysConfig) {
			var service = {
				config: null,
				getConfig: function() {
					if (service.config) {
						return $q.when(service.config);
					} else {
						return $http.post('/api/' + sysConfig.module + '/config/getConfig', {project:sysConfig.project}).then(function(response) {
							service.config = response.data;
							return service.config;
						});
					}
				}

			};
			return service;
		}
	]);