angular.module('tasks')
	.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function ($stateProvider, sysConfig, securityAuthorizationProvider) {

			var types = {
				name: 'page.types',
				url: '/dictionary/types',
				views: {
					'content': {
						templateUrl: sysConfig.src('tasks/task-type/taskTypeList.tpl.html')/*,
						controller: 'taskTypeCtrl'*/
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
	.controller('taskTypeCtrl', ['$scope', 'promiseTracker', 'sysConfig', 'apinetService', '$window',
		function($scope, promiseTracker, sysConfig, apinetService, $window) {

			
			
			$scope.validationReset = function() {
				$scope.validation = {
					generalError: null,
					fieldErrors: {}
				};				
			};

			var handleException = function(error) {
				$scope.validationReset();
				$scope.validation.generalError = error;
			};
			var handleError = function(result) {
				$scope.validationReset();
				angular.extend($scope.validation, result);
			};
			var refresh = function() {
				$scope.refreshList();
				$scope.validationReset();
			}

			$scope.createTaskType = function() {
				$scope.editModel.id = null;
				apinetService.action({
					method: 'tasks/dictionary/editTaskType',
					project: sysConfig.project,
					model: $scope.editModel})
				.then(function(result) {
					if(result.success) {
						$scope.editModel.name = '';
						refresh();
					} else {
						handleError(result);
					}
				}, handleException);
			};

			$scope.hasSelected = function() {
				for(var i = 0; i < $scope.models.length; i++) {
					if ($scope.models[i].selected && $scope.models[i].selected === true)
						return true;
				}

				return false;
			};

			$scope.deleteSelected = function() {
				if (!$window.confirm('Вы действительно хотите удалить записи?')) return;

				var ids = [];
				for(var i = 0; i < $scope.models.length; i++) {
					if ($scope.models[i].selected && $scope.models[i].selected === true)
						ids.push($scope.models[i].Id);
				};
				if (ids.length <= 0) return;

				apinetService.action({
					method: 'tasks/dictionary/deleteTaskTypes',
					project: sysConfig.project,
					ids: ids })
				.then(refresh, handleException);
			};

			$scope.delete = function(id) {
				if (!id) return;
				if (!$window.confirm('Вы действительно хотите удалить запись?')) return;

				apinetService.action({
					method: 'tasks/dictionary/deleteTaskType',
					project: sysConfig.project,
					id: id })
				.then(refresh, handleException);	
			};

			$scope.test = function() {
				console.log($scope.models);
			};

			$scope.loading = promiseTracker('projects');
			$scope.requestParams = { project: sysConfig.project };
			$scope.gridOptions = {
				totalRowsCount: 10,
				pageSize: 10,
				page: 1,
				numPages: 1
			};

			$scope.editModel = {id: null, name: ''};
			$scope.validationReset();
	}]);
	