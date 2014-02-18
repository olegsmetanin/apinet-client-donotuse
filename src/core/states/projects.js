define([
	'../moduleDef',
	'angular',
	'text!./moduleMenu.tpl.html',
	'./page'
], function (module, angular, moduleMenuTpl) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state('page.projects', {
			abstract: true,
			views: {
				'content': { template: '<div ui-view></div>' },
				'moduleMenu': { 
					template: moduleMenuTpl,
					controller: ['$scope', 'security', function($scope, security) {
						$scope.$watch(function() { return security.isAdmin(); }, 
							function(newValue) { $scope.isAdmin = newValue; });
					}]
				}
			},
			onEnter: function($rootScope) {
				$rootScope.breadcrumbs.push({
					name: 'projects.list.title',
					url: 'page.projects.projectsList'
				});
			},
			onExit: function($rootScope) {
				$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
			}
		});
	}]);
});