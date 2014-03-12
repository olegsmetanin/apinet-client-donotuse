define([
	'../../moduleDef',
	'angular',
	'text!./activityList.tpl.html',
	'text!../moduleMenu.tpl.html'
], function (module, angular, tpl, moduleMenuTpl) {

	module.state({
		name: 'page.project.activities',
		url: '/activities',
		views: {
			'': { template: tpl },
			'moduleMenu@page': { template: moduleMenuTpl }
		},

		onEnter: function($rootScope) {
			$rootScope.breadcrumbs.push({
				name: 'core.activities.title',
				url: 'page.project.activities'
			});
		},
		onExit: function($rootScope) {
			$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
		}
	})
	.controller('activityListCtrl', ['$scope', function($scope) {
		$scope.$on('resetFilter', function() {
			$scope.filter.simple = {
				period: 'today'
			};
		});

		$scope.$watch('filter.simple.period', function(value) {
			$scope.requestParams.predefined = value || 'today';
		}, true);
	}]);
});
