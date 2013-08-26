angular.module('core')
	.service("pageConfig", ['$rootScope',
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