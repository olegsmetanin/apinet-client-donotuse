define(['../moduleDef'], function (module) {
	module.state({
		name: 'page.project.tasks',
		views: {
			'': { template: '<div ui-view></div>' }
		},
		onEnter: function($rootScope, $state) {
			var unwatch = $rootScope.$watch('currentProjectName', function(value) {
				if(!value) {
					return;
				}
				unwatch();

				$rootScope.breadcrumbs.push({
					name: value,
					url: 'page.project.tasks.tasksList'
				});

				$state.go('page.project.tasks.tasksList');
			});
		},
		onExit: function($rootScope) {
			$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
		}
	});
});