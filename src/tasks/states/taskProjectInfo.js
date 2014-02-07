define([
	'../moduleDef',
	'angular',
	'text!./taskProjectInfo.tpl.html',
	'text!./moduleMenu.tpl.html'
], function (module, angular, tpl, moduleMenuTpl) {
	module.state({
		name: 'page.project.settings',
		url: '/settings',
		views: {
			'': { template: tpl },
			'moduleMenu@page': { template: moduleMenuTpl }
		},
		onEnter: function(pageConfig, i18n, $rootScope) {
			var unwatch = $rootScope.$watch('currentProjectName', function(value) {
				if(!value) {
					return;
				}
				unwatch();

				pageConfig.setConfig({
					breadcrumbs: [
						{ name: i18n.msg('projects.list.title'), url: 'page.projects.projectsList' },
						{ name: value, url: 'page.project.tasks' },
						{ name: i18n.msg('projects.settings.title'), url: 'page.project.settings' }
					]
				});
			});
		}
	}).controller('projectInfoCtrl', ['$scope', '$stateParams', 'apinetService', 'i18n', 
		function($scope, $stateParams, apinetService, i18n) {
			$scope.info = "Project info will be there";
		}
	]);
});