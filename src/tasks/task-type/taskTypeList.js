angular.module('tasks')
.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
	function ($stateProvider, sysConfig, securityAuthorizationProvider) {

		var types = {
			name: 'page.types',
			url: '/dictionary/types',
			views: {
				'content': {
					templateUrl: sysConfig.src('tasks/task-type/taskTypeList.tpl.html')
				}
			},
			resolve: {
				pageConfig: 'pageConfig',
				authUser: securityAuthorizationProvider.requireAuthenticatedUser()
			},
			onEnter: function(pageConfig) {
				pageConfig.setConfig({
					breadcrumbs: [
						{ name: 'Tasks', url: '#!/' },
						{ name: 'Task types', url: '#!/dictionary/types' }]
				});
			}
		};

		$stateProvider.state(types);
	}
])
.controller('taskTypeCtrl', ['$scope', 'sysConfig', 'apinetService', '$window',
	function($scope, sysConfig, apinetService, $window) {
		var handleException = function(error) {
			$scope.resetValidation();
			$scope.validation.generalErrors = [error];
		};
		var handleError = function(validation) {
			$scope.resetValidation();
			angular.extend($scope, validation);
		};

		$scope.removeFromModels = function(modelsToRemove) {
			for(var i = 0; i < modelsToRemove.length; i++) {
				var index = $scope.models.indexOf(modelsToRemove[i]);
				if (index < 0) continue;
				$scope.models.splice(index, 1);
			}
		};

		$scope.createTaskType = function() {
			$scope.resetValidation();
			$scope.editModel.id = null;

			apinetService.action({
				method: 'tasks/dictionary/editTaskType',
				project: sysConfig.project,
				model: $scope.editModel})
			.then(function(result) {
				if(result.validation.success) {
					$scope.editModel.name = '';
					$scope.createTaskTypeForm.$setPristine();
					$scope.models.unshift(result.model);
				} else {
					handleError(result);
				}
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

		$scope.deleteSelected = function() {
			if (!$window.confirm('Вы действительно хотите удалить записи?')) {
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

			$scope.resetValidation();

			var replaceId = null;
			if ($scope.deleteModel.replacementType && $scope.deleteModel.replacementType.id) {
				replaceId = $scope.deleteModel.replacementType.id;
			}

			apinetService.action({
				method: 'tasks/dictionary/deleteTaskTypes',
				project: sysConfig.project,
				ids: ids,
				replacementTypeId: replaceId })
			.then(function() {
				$scope.removeFromModels(modelsToRemove);
			}, handleException);
		};

		$scope.delete = function(model) {
			if (!model) {
				return;
			}
			if (!$window.confirm('Вы действительно хотите удалить запись?')) {
				return;
			}

			apinetService.action({
				method: 'tasks/dictionary/deleteTaskType',
				project: sysConfig.project,
				id: model.Id })
			.then(function() {
				$scope.removeFromModels([model]);
			}, handleException);	
		};

		$scope.onUpdate = function(model, val) {
			//not changed
			if (model.Name === val) {
				return;
			}

			$scope.resetValidation();
			model.Name = val;

			apinetService.action({
				method: 'tasks/dictionary/editTaskType',
				project: sysConfig.project,
				model: { id: model.Id, Name: val }
			}).then(function(response) {
				if (response.validation.success) {
					angular.extend(model, response.model);
				} else {
					handleError(response.validation);
				}
			}, handleException);
		};

		$scope.requestParams = { project: sysConfig.project };
		$scope.editModel = {id: null, name: ''};
		$scope.deleteModel = { replacementType: null };
}]);