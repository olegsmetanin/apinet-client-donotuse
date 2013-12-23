define([
	'../../moduleDef',
	'angular',
	'text!./taskList.tpl.html',
	'text!../moduleMenu.tpl.html'
], function (module, angular, tpl, moduleMenuTpl) {

	module.state({
		name: 'page.project.tasks',
		url: '/tasks',
		views: {
			'': { template: tpl },
			'moduleMenu@page': { template: moduleMenuTpl }
		},
		resolve: {
			i18n: 'i18n',
			pageConfig: 'pageConfig'
		},
		onEnter: function(pageConfig, i18n) {
			pageConfig.setConfig({
				menu: 'tasks.list',
				breadcrumbs: [{
					name: i18n.msg('tasks.list.title'),
					url: 'page.project.tasks'
				}]
			});
		}
	}).controller('taskListCtrl', ['$scope', '$stateParams', 'apinetService', '$window', 'i18n', 'taskStatuses', '$locale',
		function($scope, $stateParams, apinetService, $window, i18n, taskStatuses, $locale) {

		$scope.REPORT_TYPES = ['task-list'];

		$scope.propsFilterCollapsed = true;
		$scope.taskStatuses = taskStatuses;

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
				project: $stateParams.project,
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
				project: $stateParams.project,
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
				project: $stateParams.project,
				numpp: task.SeqNumber})
			.then(function(response) {
				angular.extend(task.details, response);
				task.details.loaded = true;
			}, handleException);
		};

		$scope.expiration = function(task) {
			if (!task.DueDate) {
				return null;
			} //no due date set - can't calculate expiration
			if (task.Status === taskStatuses.Closed) {
				return null;
			} //closed task can't be expired
			if (!angular.isDefined(task.expiration)) {

				var now = new Date();
				var dd = new Date(task.DueDate);

				var f = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
							now.getHours(), now.getMinutes(), now.getSeconds());
				var s = Date.UTC(dd.getFullYear(), dd.getMonth(), dd.getDate(),
							dd.getHours(), dd.getMinutes(), dd.getSeconds());
				var ms = f-s;
				//TODO: to consts?
				var MS_PER_DAY = 1000 * 60 * 60 * 24;
				var daysDiff = Math.floor(ms/MS_PER_DAY);
				var pcat = $locale.pluralCat(Math.abs(daysDiff));
				var daysText = '';
				switch(pcat) {
					case 'one':
					case 'few':
					case 'many':
					case 'other':
						daysText = i18n.msg('tasks.view.statusHistory.duration.days.' + pcat);
						break;
					case 'zero':
					case 'two':
					default:
						daysText = '';
						break;
				}

				var msgKey = 'tasks.list.expiration.' + (daysDiff < 0 ? 'already' : 'will');
				var msg = i18n.msg(msgKey, {days: Math.abs(daysDiff), daysText: daysText});
				task.expiration = { 
					days: Math.abs(daysDiff), 
					expired: daysDiff < 0,
					title: msg
				};
			}

			return task.expiration;
		};

		$scope.fillReportParameters = function(settings, p) {
			p.parameters = {
				project: $stateParams.project,
				filter: $scope.filter,
				sorters: $scope.sortersArray,
				predefined: $scope.requestParams.predefined
			};
		};

		$scope.onReportError = function(error) {
			handleException(error);
		};

		var handleException = function(error) {
			$scope.resetValidation();
			$scope.validation.generalErrors = [error];
		};
	}]);
});