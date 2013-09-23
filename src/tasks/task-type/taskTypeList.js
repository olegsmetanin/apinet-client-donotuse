angular.module('tasks')
	.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function ($stateProvider, sysConfig, securityAuthorizationProvider) {

			var types = {
				name: 'page.types',
				url: '/dictionary/types',
				views: {
					'content': {
						templateUrl: sysConfig.src('tasks/task-type/taskTypeList.tpl.html'),
						controller: 'taskTypeCtrl'
					}
				},
				resolve: {
					pageConfig: 'pageConfig',
					promiseTracker: 'promiseTracker',
					authUser: securityAuthorizationProvider.requireAuthenticatedUser()
				},
				onEnter: function(pageConfig) {
					pageConfig.setConfig({
						breadcrumbs: [
							{ name: 'Tasks', url: '#!/' },
							{ name: 'Tasks types', url: '#!/dictionary/types' }]
					});
				}
			};

			$stateProvider.state(types);
		}
	])
	.controller('taskTypeCtrl', ['$scope', 'promiseTracker', 'sysConfig', 'apinetService', 
		function($scope, promiseTracker, sysConfig, apinetService) {

			$scope.loading = promiseTracker('projects');
			$scope.requestParams = { project: sysConfig.project };
			$scope.gridOptions = {
				totalRowsCount: 10,
				pageSize: 10,
				page: 1,
				numPages: 1
			};

			$scope.editModel = {id: null, name: ''};
			$scope.validation = {
				generalError: null,
				fieldErrors: {}
			};

			$scope.createTaskType = function() {
				$scope.editModel.id = null;
				apinetService.action({
					method: 'tasks/dictionary/editTaskType',
					project: sysConfig.project,
					model: $scope.editModel})
				.then(function(result) {
					if(result.success) {
						$scope.editModel.name = '';
						$scope.refreshList();
					} else {
						angular.extend($scope.validation, result);
					}
				}, function(error) {
					$scope.validation.generalError = error;
				});
			};
	}]);