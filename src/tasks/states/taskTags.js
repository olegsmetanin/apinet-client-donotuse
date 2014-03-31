define([
	'../moduleDef',
	'angular',
	'text!./moduleMenu.tpl.html',
	'text!../../core/states/tags/tags.tpl.html'
], function (module, angular, moduleMenuTpl, tpl) {
	module.state({
		name: 'page.project.tasksTags',
		url: '/tags',
		views: {
			'': { template: tpl, controller: 'tagsCtrl' },
			'moduleMenu@page': { template: moduleMenuTpl }
		},
		resolve: {
			tagTypes: function() { return [{id: 'tasks.task', code: 'tasks.tags.type'}]; }
		},
		onEnter: ['$rootScope', function($rootScope) {
			$rootScope.breadcrumbs.push({
				name: 'projects.tags.title',
				url: 'page.project.tasksTags'
			});
		}],
		onExit: function($rootScope) {
			$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
		}
	});
});
