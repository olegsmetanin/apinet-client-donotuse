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
			onEnter: function(apinetService, $state, $stateParams, $rootScope) {
				$rootScope.breadcrumbs.push({
					name: 'projects.list.title',
					url: 'page.projects.projectsList'
				});

				apinetService.getModel({
					method: 'core/projects/projectInfo',
					project: $stateParams.project
				}).then(function(data) {
					if(!data || !data.Module) {
						return;
					}

					//used in moduleConfig for requesting module configuration
					//and in security/service for switching user role in project
					$rootScope.module = data.Module;
					$rootScope.currentProjectName = data.Name;

					var m = data.Module.toLowerCase();

					var breadcrumb = {
						name: $rootScope.currentProjectName,
						url: 'page.project.' + m
					};

					if($rootScope.breadcrumbs.length > 1) {
						$rootScope.breadcrumbs.splice(1,0, breadcrumb);
					}
					else {
						$rootScope.breadcrumbs.push(breadcrumb);
					}

					require([m], function() {
						require([m + '/module'], function () {
							if($state.current.name === 'page.project') {
								$state.go('.' + m);
							}
						});
					});
				}, function() {
					$state.go('page.projects.projectsList');
				});
			},
			onExit: function($rootScope) {
				var count = 1;
				if($rootScope.currentProjectName) {
					count = 2;
				}

				$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - count, count);

				delete $rootScope.module;
				delete $rootScope.currentProjectName;
			}
		});
	}]);
});