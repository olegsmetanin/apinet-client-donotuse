define([
	'../../../moduleDef',
	'angular',
	'text!./taskCreate.tpl.html',
	'text!../../moduleMenu.tpl.html',
	'../../tasks'
], function (module, angular, tpl, moduleMenuTpl) {
	module.state({
		name: 'page.project.tasks.taskCreate',
		url: '/newTask',
		views: {
			'': { template: tpl },
			'moduleMenu@page': { template: moduleMenuTpl }
		},
		onEnter: function($rootScope) {
			var unwatch = $rootScope.$watch('currentProjectName', function(value) {
				if(!value) {
					return;
				}
				unwatch();

				$rootScope.breadcrumbs.push({
					name: 'tasks.create.title',
					url: 'page.project.tasks.taskCreate'
				});
			});
		},
		onExit: function($rootScope) {
			$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
		}
	}).controller('taskCreateCtrl', ['$scope', '$stateParams', 'apinetService', '$state',
		function($scope, $stateParams, apinetService, $state) {

			$scope.cancel = function() {
				$state.go('page.project.tasks.tasksList');
			};

			$scope.create = function() {
				var req = modelToRequest();
				apinetService.action({
					method: 'tasks/tasks/createTask',
					project: $stateParams.project,
					model: req })
				.then(function(response) {
					if (response.validation.success) {
						if ($scope.nextAction === 'goToTask') {
							$state.transitionTo('page.project.tasks.taskView', {
								num: response.model,
								project: $stateParams.project
							}, true);
						} else if ($scope.nextAction === 'goToList') {
							$state.transitionTo('page.project.tasks.tasksList', { project: $stateParams.project }, true);
						} else if ($scope.nextAction === 'stayHere') {
							$scope.model = initModel();
							$scope.form.$setPristine();
						}
					} else {
						resetValidation();
						angular.extend($scope.validation, response.validation);
					}
				}, function(error) {
					resetValidation();
					$scope.validation.generalErrors = [error];
				});
			};

			var initModel = function() {
				return {
					taskType: null,
					executors: [],
					dueDate: null,
					content: null,
					priority: null
				};
			};

			$scope.model = initModel();

			$scope.nextAction = 'goToTask';
			$scope.validation = { };

			var modelToRequest = function() {
				var m = $scope.model;
				var e = [];
				angular.forEach(m.executors, function(v) { this.push(v.id); }, e);
				return {
					TaskType: m.taskType.id,
					Executors: e,
					DueDate: m.dueDate,
					Content: m.content,
					Priority: m.priority ? m.priority.id : null
				};
			};

			var resetValidation = function() {
				$scope.validation.generalErrors = [];
				$scope.validation.fieldErrors = {};
			};
		}
	]);
});