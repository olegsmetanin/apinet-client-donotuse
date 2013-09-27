angular.module('tasks')
.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig', 'securityAuthorizationProvider',
	function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig, securityAuthorizationProvider) {

	var home = {
			name: 'page.home',
			url: '',
			views: {
				'content': {
					templateUrl: sysConfig.src('tasks/task/taskList.tpl.html')
				}
			},
			resolve: {
				pageConfig: 'pageConfig',
				promiseTracker: 'promiseTracker',
				authUser: securityAuthorizationProvider.requireAuthenticatedUser()
			},
			onEnter: function(pageConfig) {
				pageConfig.setConfig({
					breadcrumbs: [{
						name: 'Tasks',
						url: '/#!/'
					}]
				});
			}
		};

		var root = angular.copy(home);
		root.name = 'page.root';
		root.url = '/';

		var tasks = angular.copy(home);
		tasks.name = 'page.tasks';
		tasks.url = '/tasks';

		$stateProvider.state(home);
		$stateProvider.state(root);
		$stateProvider.state(tasks);
	}
])
.controller('taskListCtrl', ['$scope', 'promiseTracker', 'sysConfig', 'apinetService', '$window', '$timeout', 
	function($scope, promiseTracker, sysConfig, apinetService, $window, $timeout) {

		$scope.deleteSelected = function() {
			if (!$window.confirm('Вы действительно хотите удалить задачи?')) {
				return;
			}

			var ids = [];
			var modelsToRemove = [];
			for(var i = 0; i < $scope.models.length; i++) {
				if ($scope.models[i].selected && $scope.models[i].selected === true) {
					ids.push($scope.models[i].Id);
					modelsToRemove.push($scope.models[i]);
				}
			}
			if (ids.length <= 0) {
				return;
			}

			apinetService.action({
				method: 'tasks/tasks/deleteTasks',
				project: sysConfig.project,
				ids: ids })
			.then(function(response) {
				for(var i = 0; i < modelsToRemove.length; i++) {
					var index = $scope.models.indexOf(modelsToRemove[i]);
					if (index < 0) continue;
					$scope.models.splice(index, 1);
				}
			}, handleException);
		}

		$scope.delete = function(task) {
			if (!$window.confirm('Вы действительно хотите удалить задачу?')) {
				return;
			}

			apinetService.action({
				method: 'tasks/tasks/deleteTask',
				project: sysConfig.project,
				id: task.Id})
			.then(function(response) {
				var taskIndex = $scope.models.indexOf(task);
				if(taskIndex === -1) {
					return;
				}
				$scope.models.splice(taskIndex, 1);
			}, handleException)
		};

		$scope.hasSelected = function() {
			for(var i = 0; i < $scope.models.length; i++) {
				if ($scope.models[i].selected && $scope.models[i].selected === true) {
					return true;
				}
			}

			return false;
		};

		var handleException = function(error) {
			$scope.resetValidation();
			$scope.validation.generalErrors = [error];
		};

		$scope.loading = promiseTracker('tasks');
		$scope.requestParams = { project: sysConfig.project };
}]);