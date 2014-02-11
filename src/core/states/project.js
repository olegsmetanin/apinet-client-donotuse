define([
	'../moduleDef',
	'require',
	'angular',
	'text!./moduleMenu.tpl.html',
	'./page'
], function (module, require, angular, moduleMenuTpl) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state('page.project', {
			url: '/project/:project',
			views: {
				'content': { template: '<div ui-view></div>' },
				'moduleMenu': { template: moduleMenuTpl }
			},
			onEnter: function(apinetService, $state, $stateParams, $rootScope, $location){
				apinetService.getModel({
					method: 'core/projects/projectInfo',
					project: $stateParams.project
				}).then(function(data) {
					if(!data || !data.Module) {
						return;
					}
					$rootScope.currentProjectName = data.Name;
					require([data.Module], function() {
						require([data.Module + '/module'], function () {
							$state.go('page.project.' + data.Module);
						});
					});
				}, function() {
					$state.go('page.projects.projectsList');
				});
			}
		});
	}]);
});