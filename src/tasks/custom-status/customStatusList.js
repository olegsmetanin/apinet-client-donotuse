angular.module('tasks')
	.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function ($stateProvider, sysConfig, securityAuthorizationProvider) {

			var statuses = {
				name: 'page.statuses',
				url: '/dictionary/statuses',
				views: {
					'content': {
						templateUrl: sysConfig.src('tasks/custom-status/customStatusList.tpl.html')
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
							{ name: 'Tasks statuses', url: '#!/dictionary/statuses' }]
					});
				}
			};

			$stateProvider.state(statuses);
		}
	])
	.controller('customStatusCtrl', ['$scope', 'promiseTracker', 'sysConfig', 'apinetService', '$window', '$timeout',
		function($scope, promiseTracker, sysConfig, apinetService, $window, $timeout) {
			var handleException = function(error) {
				$scope.resetValidation();
				$scope.validation.generalErrors = error;
			};
			var handleError = function(result) {
				$scope.resetValidation();
				angular.extend($scope.validation, result);
			};
			var refresh = function() {
				$scope.refreshList();
				$scope.resetValidation();
			};

			$scope.createStatus = function() {
				$scope.editModel.id = null;
				apinetService.action({
					method: 'tasks/dictionary/editCustomStatus',
					project: sysConfig.project,
					model: $scope.editModel})
				.then(function(result) {
					if(result.success) {
						$scope.editModel.name = '';
						$scope.editModel.viewOrder = null;
						$scope.$$childHead.$$nextSibling.createStatusForm.$setPristine();
						refresh();
					} else {
						handleError(result);
					}
				}, handleException);
			};

			$scope.isViewOrderInvalid = function() {
				var f = $scope.$$childHead.$$nextSibling.createStatusForm;
				return f.viewOrder.$dirty && !f.viewOrder.$valid;
			};

			$scope.hasSelected = function() {
				for(var i = 0; i < $scope.models.length; i++) {
					if ($scope.models[i].selected && $scope.models[i].selected === true) {
						return true;
					}
				}

				return false;
			};

			$scope.deleteSelected = function() {
				if (!$window.confirm('Вы действительно хотите удалить записи?')) {
					return;
				}

				var ids = [];
				for(var i = 0; i < $scope.models.length; i++) {
					if ($scope.models[i].selected && $scope.models[i].selected === true) {
						ids.push($scope.models[i].Id);
					}
				}
				if (ids.length <= 0) {
					return;
				}

				var replaceId = null;
				if ($scope.deleteModel.replacementStatus && $scope.deleteModel.replacementStatus.id) {
					replaceId = $scope.deleteModel.replacementStatus.id;
				}

				apinetService.action({
					method: 'tasks/dictionary/deleteCustomStatuses',
					project: sysConfig.project,
					ids: ids,
					replacementStatusId: replaceId })
				.then(refresh, handleException);
			};

			$scope.delete = function(id) {
				if (!id) {
					return;
				}
				if (!$window.confirm('Вы действительно хотите удалить запись?')) {
					return;
				}

				apinetService.action({
					method: 'tasks/dictionary/deleteCustomStatus',
					project: sysConfig.project,
					id: id })
				.then(refresh, handleException);	
			};

			$scope.onUpdateName = function(val) {
				if (!val || !val.model || !val.value) {
					return;
				}
				//not changed
				if (val.model.Name === val.value) {
					return;
				}

				//temporary change with unsaved indicator
				val.model.Name = val.value + ' *';
				apinetService.action({
					method: 'tasks/dictionary/editCustomStatus',
					project: sysConfig.project,
					model: { id: val.model.Id, Name: val.value, ViewOrder: val.model.ViewOrder }
				}).then(refresh, handleException);
			};

			$scope.onUpdateViewOrder = function(val) {
				if (!val || !val.model) {
					return;
				}
				//not changed
				if (val.model.ViewOrder === val.value) {
					return;
				}

				var vo = val.value ? parseInt(val.value, val.model.viewOrder) : 0;

				apinetService.action({
					method: 'tasks/dictionary/editCustomStatus',
					project: sysConfig.project,
					model: { id: val.model.Id, Name: val.model.Name, ViewOrder: vo }
				}).then(refresh, handleException);
				//temporary change with unsaved indicator
				val.model.Name = val.model.Name + ' *';
				val.model.ViewOrder = vo;
			};

			$scope.replaceLookupOptions = {
				allowClear: true,
				multiple: false,
				query: function(query) {
					$timeout(function(){
						apinetService.action({
							method: 'tasks/dictionary/lookupCustomStatuses',
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

			$scope.editModel = {id: null, name: '', viewOrder: null};
			$scope.deleteModel = { replacementStatus: null };
	}]);
	