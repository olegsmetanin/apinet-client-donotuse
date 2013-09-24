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
	.controller('taskTypeCtrl', ['$scope', 'promiseTracker', 'sysConfig', 'apinetService', '$window', '$timeout',
		function($scope, promiseTracker, sysConfig, apinetService, $window, $timeout) {
			
			$scope.resetValidatioin = function() {
				$scope.validation = {
					generalError: null,
					fieldErrors: {}
				};				
			};

			var handleException = function(error) {
				$scope.resetValidatioin();
				$scope.validation.generalError = error;
			};
			var handleError = function(result) {
				$scope.resetValidatioin();
				angular.extend($scope.validation, result);
			};
			var refresh = function() {
				$scope.refreshList();
				$scope.resetValidatioin();
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

				var replaceId = null;
				if ($scope.deleteModel.replacementType && $scope.deleteModel.replacementType.id) {
					replaceId = $scope.deleteModel.replacementType.id;
				}

				apinetService.action({
					method: 'tasks/dictionary/deleteTaskTypes',
					project: sysConfig.project,
					ids: ids,
					replacementTypeId: replaceId })
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

			$scope.onUpdate = function(val) {
				//problem in code
				if (!val || !val.model || !val.value) return;
				//not changed
				if (val.model.Name === val.value) return;

				//temporary change with unsaved indicator
				val.model.Name = val.value + ' *';
				apinetService.action({
					method: 'tasks/dictionary/editTaskType',
					project: sysConfig.project,
					model: { id: val.model.Id, Name: val.value }
				}).then(refresh, handleException);
			};

			$scope.replaceLookupOptions = {
				allowClear: true,
				multiple: false,
				query: function(query) {
					$timeout(function(){
						apinetService.action({
							method: 'tasks/dictionary/lookupTaskTypes',
							project: sysConfig.project,
							term: query.term })
						.then(function(response) {
							query.callback({ results: response || [] });
						}, handleException);
					});
				}
			};

			$scope.loading = promiseTracker('projects');
			$scope.requestParams = { project: sysConfig.project };

			$scope.editModel = {id: null, name: ''};
			$scope.deleteModel = { replacementType: null };
			$scope.resetValidatioin();
	}]);
	