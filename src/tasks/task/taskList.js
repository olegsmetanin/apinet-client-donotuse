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
			$scope.customFilter.selected = $scope.customFilter.predefined[0];
		});

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

		$scope.constructCombinedFilter = function() {
			$scope.filter.simple = $scope.filter.simple || { };

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
						items: [
							{path: 'Status', op: '=', value: 'Closed'},
							{path: 'StatusHistory.Status', op: '=', value: 'Closed'},
							{path: 'StatusHistory.Start', op: '>=', value: yesterday},
							{path: 'StatusHistory.Start', op: '<', value: today}]
					};
					break;
				case $scope.customFilter.ALL:
					$scope.filter.simple.Combined = null;
					break;
				default:
					$scope.filter.simple.Combined = null;
			}
		};

		$scope.constructDueDateFilter = function() {
			$scope.filter.simple = $scope.filter.simple || { };

			if ($scope.customFilter.lDate) {
				$scope.filter.simple.DueDateLeft = {
					path: 'DueDate',
					op: '>=',
					value: $scope.customFilter.lDate
				};
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
				};
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
			{value: $scope.customFilter.ALL, text: i18n.msg('tasks.list.filters.custom.predefined.all') },
			{value: $scope.customFilter.OVERDUE, text: i18n.msg('tasks.list.filters.custom.predefined.overdue') },
			{value: $scope.customFilter.DAY_LEFT, text: i18n.msg('tasks.list.filters.custom.predefined.dayLeft') },
			{value: $scope.customFilter.WEEK_LEFT, text: i18n.msg('tasks.list.filters.custom.predefined.weekLeft') },
			{value: $scope.customFilter.NO_LIMIT, text: i18n.msg('tasks.list.filters.custom.predefined.noLimit') },
			{value: $scope.customFilter.CLOSED_TODAY, text: i18n.msg('tasks.list.filters.custom.predefined.closedToday') },
			{value: $scope.customFilter.CLOSED_YESTERDAY, text: i18n.msg('tasks.list.filters.custom.predefined.closedYesterday') }
		];
		$scope.customFilter.selected = $scope.customFilter.predefined[0];
}]);