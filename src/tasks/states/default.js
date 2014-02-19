define(['../moduleDef', './tasks'], function (module) {
	module.state({
		name: 'page.project.tasks.default',
		views: {
			'': { template: '<div ui-view></div>' }
		},
		onEnter: function($state) {
			$state.go('page.project.tasks.tasksList');
		}
	});
});