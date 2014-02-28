define([
	'../moduleDef',
	'angular',
	'text!./timelogView.tpl.html'
], function (module, angular, tpl) {
	module.directive('timelog', ['apinetService', '$window', 'i18n', '$rootScope', 'taskStatuses', '$stateParams',
		function(apinetService, $window, i18n, $rootScope, taskStatuses, $stateParams) {
			return {
				restrict: 'E',
				template: tpl,
				scope: {
					model: '=',
					onChange: '=changed'
				},
				link: function($scope) {
					$scope.i18n = $rootScope.i18n;

					$scope.editables = {
						time: null,
						comment: null
					};

					$scope.isTimelogEditable = function() {
						return $scope.model && $scope.model.Status.id !== taskStatuses.Closed;
					};

					$scope.hasAddError = function() {
						return !(!isNaN(parseFloat($scope.editables.time)) 
						&& isFinite($scope.editables.time));
					};

					$scope.add = function() {
						apinetService.action({
							method: 'tasks/tasks/trackTime',
							project: $stateParams.project,
							taskId: $scope.model.Id,
							time: $scope.editables.time,
							comment: $scope.editables.comment })
						.then(function(response) {
							$scope.model.Timelog.push(response);
							$scope.onChange(response.Time);
						}, handleException)
					};

					$scope.delete = function(entry) {
						if (!$window.confirm($scope.i18n.msg('core.confirm.delete.record'))) {
							return;
						}

						apinetService.action({
							method: 'tasks/tasks/deleteTime',
							project: $stateParams.project,
							timeId: entry.Id })
						.then(function() {
							var idx = $scope.model.Timelog.indexOf(entry);
							if (idx >= 0) {
								$scope.model.Timelog.splice(idx, 1);
							}
							$scope.onChange(-entry.Time);
						}, handleException)
					};

					$scope.updateTime = function(entry, prop, val) {
						if (!$scope.isTimelogEditable()) {
							handleException($scope.i18n.msg('tasks.view.timelog.closed'));
							return false;
						};

						return apinetService.action({
							method: 'tasks/tasks/updateTime',
							project: $stateParams.project,
							timeId: entry.Id,
							time: (prop === 'time' ? val : entry.Time),
							comment: (prop === 'comment' ? val : entry.Comment)
						}).then(function(response) {
							if (prop === 'time') {
								$scope.onChange(response.Time - entry.Time);
							}
							angular.extend(entry, response);
							return true;
						}, function(error) {
							handleException(error);
							return false;
						});
					}

					$scope.resetValidation = function() {
						$scope.validation = { };
					};

					var handleException = function(error) {
						$scope.resetValidation();
						$scope.validation.generalErrors = [error];
					};

					$scope.resetValidation();
				}
			};
		}
	])
});