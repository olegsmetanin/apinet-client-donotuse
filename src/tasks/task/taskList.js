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
				i18n: 'i18n',
				pageConfig: 'pageConfig',
				authUser: securityAuthorizationProvider.requireAuthenticatedUser()
			},
			onEnter: function(pageConfig, i18n) {
				pageConfig.setConfig({
					menu: 'tasks.list',
					breadcrumbs: [{
						name: i18n.msg('tasks.list.title'),
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
.controller('taskListCtrl', ['$scope', 'sysConfig', 'apinetService', '$window', 'i18n',
	function($scope, sysConfig, apinetService, $window, i18n) {

	$scope.$on('resetFilter', function() {
		$scope.filter.simple = {
			Combined: 'all'
		};
	});
	$scope.$watch('filter.simple.Combined', function(value) {
		$scope.requestParams.predefined = value || 'all';
	}, true);

	$scope.deleteSelected = function() {
		if (!$window.confirm(i18n.msg('tasks.confirm.delete.tasks'))) {
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
		.then(function() {
			for(var i = 0; i < modelsToRemove.length; i++) {
				var index = $scope.models.indexOf(modelsToRemove[i]);
				if (index < 0) {
					continue;
				}
				$scope.models.splice(index, 1);
			}
		}, handleException);
	};

	$scope.delete = function(task) {
		if (!$window.confirm(i18n.msg('tasks.confirm.delete.task'))) {
			return;
		}

		apinetService.action({
			method: 'tasks/tasks/deleteTask',
			project: sysConfig.project,
			id: task.Id})
		.then(function() {
			var taskIndex = $scope.models.indexOf(task);
			if(taskIndex === -1) {
				return;
			}
			$scope.models.splice(taskIndex, 1);
		}, handleException);
	};

	$scope.hasSelected = function() {
		for(var i = 0; i < $scope.models.length; i++) {
			if ($scope.models[i].selected && $scope.models[i].selected === true) {
				return true;
			}
		}

		return false;
	};

	$scope.toggleDetails = function(task) {
		task.details.expanded = !task.details.expanded;
		if (!task.details.expanded) {
			//not expanded - nothing to show
			return;
		}
		if (task.details.loaded === true) {
			//data already loaded, simply show
			return;
		}
		//need to load data
		apinetService.action({
			method: 'tasks/tasks/GetTaskDetails',
			project: sysConfig.project,
			numpp: task.SeqNumber})
		.then(function(response) {
			angular.extend(task.details, response);
			task.details.loaded = true;
		}, handleException);
	};

	var handleException = function(error) {
		$scope.resetValidation();
		$scope.validation.generalErrors = [error];
	};
}]);