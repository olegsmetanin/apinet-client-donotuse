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
	.controller('activityListCtrl', ['$scope', '$stateParams', 'taskTabs', 'apinetService',
		function($scope, $stateParams, taskTabs, apinetService) {
			$scope.taskNum = $stateParams.num;

			$scope.initialRequestParams = {
				taskNum: $stateParams.num,
				predefined: 'today'
			};

			$scope.$on('resetFilter', function() {
				$scope.filter.simple = {
					period: 'today',
					specificDate: (new Date()).toISOString()
				};
			});

			$scope.$watch('filter.simple.period', function(value) {
				$scope.requestParams.predefined = value || 'today';
			}, true);

			$scope.$watch('filter.simple.specificDate', function(value) {
				$scope.requestParams.specificDate = value;
			}, true);

			if($scope.taskNum) {
				var handleException = function(error) {
					$scope.resetValidation();
					$scope.validation.generalErrors = [error];
				};

				$scope.tabs = taskTabs.build($scope.taskNum);

				apinetService.action({
					method: 'tasks/tasks/GetTask',
					project: $stateParams.project,
					numpp: $scope.taskNum
				}).then(function(response) {
					$scope.model = response;
					console.log('$scope.model', $scope.model);
				}, handleException);
			}
		}
	]);
});
