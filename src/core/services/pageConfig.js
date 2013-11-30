define(['../moduleDef', '../../components/angular-infrastructure'], function (module, angular) {
	module.service('pageConfig', ['$rootScope',
		function($rootScope) {
			angular.extend(this, {
				current: {},
				setConfig: function(newConfig) {
					this.current = newConfig;
					$rootScope.$broadcast('page:configChanged');
				}
			});
		}
	]);
});