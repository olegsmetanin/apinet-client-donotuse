﻿define([
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
			onEnter: function(apinetService, $state, $stateParams, $rootScope, i18n) {
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
					$rootScope.currentProjectName = data.Name;
					//used in moduleConfig for requesting module configuration
					//and in security/service for switching user role in project
					$rootScope.module = data.Module;
					require([data.Module], function() {
						require([data.Module + '/module'], function () {
							i18n.setLocale(null);

							if($state.current.name === 'page.project') {
								$state.go('page.project.' + data.Module + '.default');
							}
						});
					});
				}, function() {
					$state.go('page.projects.projectsList');
				});
			},
			onExit: function($rootScope) {
				$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
			}
		});
	}]);
});