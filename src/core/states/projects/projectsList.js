define([
	'../../moduleDef',
	'angular',
	'text!./projectsList.tpl.html',
	'jquery',
	'../projects',
	'css!./projectsList.css'
], function (module, angular, tpl, $) {
	module.config(['$stateProvider', function ($stateProvider) {
			$stateProvider.state({
				name: 'page.projects.projectsList',
				url: '/projects/listview',
				template: tpl
			});
		}])
		.controller('projectsListCtrl', ['$scope', '$timeout', function ($scope, $timeout) {
			$scope.doLayout = function() {
				$timeout(function() {
					$('.projectsWall').masonry();
				}, 0, false);
			};

			$scope.$on('resetFilter', function () {
				$scope.filter.simple = { Participation: 'All' };
				$scope.requestParams.mode = 'All';
			});

			$scope.$watch('filter.simple.Participation', function (value) {
				$scope.requestParams.mode = value || 'All';
			}, true);
		}]);
});