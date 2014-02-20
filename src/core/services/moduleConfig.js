define(['../moduleDef'], function (module) {
	module
	.service('moduleConfig', ['$q', '$rootScope', 'apinetService', 
		function ($q, $rootScope, apinetService) {

		var config = {};

		return {

			getConfig: function(project) {
				//wait for module in scope
				var deffered = $q.defer();
				if (config[project]) {
					deffered.resolve(config[project]);
				} else {
					//May be module does not exists in scope at this point, wait
					//If already presented, watch will be called immediate
					var unwatch = $rootScope.$watch('module', function(newVal) {
						if (!newVal) {
							return;
						}
						unwatch();

						apinetService.action({
							method: newVal + '/config/configuration',
							project: project
						}).then(function(response) {
							config[project] = response;
							deffered.resolve(config[project]);
						}, function(error) { deffered.reject(error); });
					});
				}
				return deffered.promise;
			},

			getRole: function (project) {
				return this.getConfig(project).then(function(cfg) {
					return cfg.current;
				});
			},

			setRole: function (project, newRole) {
				return this.getConfig(project).then(function(cfg) {
					cfg.current = newRole;
				});
			},

			getMemberRoles: function (project) {
				return this.getConfig(project).then(function(cfg) {
					return cfg.memberRoles;
				});
			},

			getRoles: function (project) {
				return this.getConfig(project).then(function(cfg) {
					return cfg.roles;
				});
			},

			clear: function() {
				config = {};
			}
		};
	}])
	.run(['moduleConfig', '$rootScope', 'AUTH_EVENTS', function(moduleConfig, $rootScope, AUTH_EVENTS) {
		$rootScope.$on(AUTH_EVENTS.LOGOUT, function() {
			moduleConfig.clear();
		});
	}]);
});