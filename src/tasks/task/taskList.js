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

		$scope.constructCombinedFilter = function() {
			var today = new Date();
			today.setHours(0, 0, 0, 0); //clear time part
			switch($scope.customFilter.selected.value) {
				case $scope.customFilter.OVERDUE:
					//if due date is today - already overdue (strange logic)
					today.setDate(today.getDate() + 1);
					//due date is less then tomorrow and task is not closed
					$scope.filter.simple.Combined = {
						op: '&&',
						items: [
							{path: 'DueDate', op: '<', value: today},
							{path: 'Status', op: '!=', value: 'Closed'}]
					};
					break;
				case $scope.customFilter.DAY_LEFT:
					today.setDate(today.getDate() + 2);
					//due date for task is next day and task is not closed
					$scope.filter.simple.Combined = {
						op: '&&',
						items: [
							{path: 'DueDate', op: '<', value: today},
							{path: 'Status', op: '!=', value: 'Closed'}]
					};
					break;
				case $scope.customFilter.WEEK_LEFT:
					today.setDate(today.getDate() + 8);
					//due date for task is next day and task is not closed
					$scope.filter.simple.Combined = {
						op: '&&',
						items: [
							{path: 'DueDate', op: '<', value: today},
							{path: 'Status', op: '!=', value: 'Closed'}]
					};
					break;
				case $scope.customFilter.NO_LIMIT:
					//no due date
					$scope.filter.simple.Combined = {path: 'DueDate', op: 'exists', not: true};
					break;
				case $scope.customFilter.CLOSED_TODAY:
					var tomorrow = new Date();
					tomorrow.setHours(0, 0, 0, 0);
					tomorrow.setDate(tomorrow.getDate() + 1);
					//task is closed and closed today
					$scope.filter.simple.Combined = {
						op: '&&',
						items: [
							{path: 'Status', op: '=', value: 'Closed'},
							{path: 'StatusHistory.Status', op: '=', value: 'Closed'},
							{path: 'StatusHistory.Start', op: '>=', value: today},
							{path: 'StatusHistory.Start', op: '<', value: tomorrow}]
					};
					break;
				case $scope.customFilter.CLOSED_YESTERDAY:
					var yesterday = new Date();
					yesterday.setHours(0, 0, 0, 0);
					yesterday.setDate(yesterday.getDate() - 1);
					//task is closed and closed yesterday
					$scope.filter.simple.Combined = {
						op: '&&',
						path: '',
						value: '',
						items: [
							{path: 'Status', op: '=', value: 'Closed'},
							{path: 'StatusHistory.Status', op: '=', value: 'Closed'},
							{path: 'StatusHistory.Start', op: '>=', value: yesterday},
							{path: 'StatusHistory.Start', op: '<', value: today}]
					};
					break;
				case $scope.customFilter.ALL:
				default:
					$scope.filter.simple.Combined = null;
			}
		};

		$scope.constructDueDateFilter = function() {
			if ($scope.customFilter.lDate) {
				$scope.filter.simple.DueDateLeft = {
					path: 'DueDate',
					op: '>=',
					value: $scope.customFilter.lDate
				}
			} else {
				$scope.filter.simple.DueDateLeft = null;
			}

			if ($scope.customFilter.rDate) {
				var dr = new Date($scope.customFilter.rDate.getTime());
				dr.setDate(dr.getDate() + 1);
				$scope.filter.simple.DueDateRight = {
					path: 'DueDate',
					op: '<',
					value: dr
				}
			} else {
				$scope.filter.simple.DueDateRight = null;
			}			
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

		$scope.loading = promiseTracker('tasks');
		$scope.requestParams = { project: sysConfig.project };
		$scope.customFilter = {
			ALL: 'all',
			OVERDUE: 'overdue',
			DAY_LEFT: 'dayLeft',
			WEEK_LEFT: 'weekLeft',
			NO_LIMIT: 'noLimit',
			CLOSED_TODAY: 'closedToday',
			CLOSED_YESTERDAY: 'closedYesterday',

			selected: null,
			predefined: null,
			lDate: null,
			rDate: null
		};
		$scope.customFilter.predefined = [
			{value: $scope.customFilter.ALL, text: 'Все' },
			{value: $scope.customFilter.OVERDUE, text: 'Просроченные' },
			{value: $scope.customFilter.DAY_LEFT, text: 'Срок 1 день' },
			{value: $scope.customFilter.WEEK_LEFT, text: 'Срок 7 дней' },
			{value: $scope.customFilter.NO_LIMIT, text: 'Без даты окончания' },
			{value: $scope.customFilter.CLOSED_TODAY, text: 'Закрыты сегодня' },
			{value: $scope.customFilter.CLOSED_YESTERDAY, text: 'Закрыты вчера' }
		];
		$scope.customFilter.selected = $scope.customFilter.predefined[0];
}]);