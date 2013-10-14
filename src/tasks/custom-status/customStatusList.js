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
				authUser: securityAuthorizationProvider.requireAuthenticatedUser()
			},
			onEnter: function(pageConfig) {
				pageConfig.setConfig({
					breadcrumbs: [
						{ name: 'Tasks', url: '#!/' },
						{ name: 'Task statuses', url: '#!/dictionary/statuses' }]
				});
			}
		};

		$stateProvider.state(statuses);
	}
])
.controller('customStatusCtrl', ['$scope', 'sysConfig', 'apinetService', '$window', 
	function($scope, sysConfig, apinetService, $window) {
		var handleException = function(error) {
			$scope.resetValidation();
			$scope.validation.generalErrors = [error];
		};
		var handleError = function(validation) {
			$scope.resetValidation();
			angular.extend($scope.validation, validation);
		};
		$scope.removeFromModels = function(modelsToRemove) {
			for(var i = 0; i < modelsToRemove.length; i++) {
				var index = $scope.models.indexOf(modelsToRemove[i]);
				if (index < 0) continue;
				$scope.models.splice(index, 1);
			}
		};

		$scope.createStatus = function() {
			$scope.resetValidation();
			$scope.editModel.id = null;

			apinetService.action({
				method: 'tasks/dictionary/editCustomStatus',
				project: sysConfig.project,
				model: $scope.editModel})
			.then(function(result) {
				if(result.validation.success) {
					$scope.editModel.name = '';
					$scope.editModel.viewOrder = null;
					$scope.createStatusForm.$setPristine();
					$scope.models.unshift(result.model);
				} else {
					handleError(result.validation);
				}
			}, handleException);
		};

		$scope.isViewOrderInvalid = function() {
			var f = $scope.createStatusForm;
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
			if ($scope.deleteModel.replacementStatus && $scope.deleteModel.replacementStatus.id) {
				replaceId = $scope.deleteModel.replacementStatus.id;
			}

			apinetService.action({
				method: 'tasks/dictionary/deleteCustomStatuses',
				project: sysConfig.project,
				ids: ids,
				replacementStatusId: replaceId })
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

			$scope.resetValidation();

			apinetService.action({
				method: 'tasks/dictionary/deleteCustomStatus',
				project: sysConfig.project,
				id: model.Id })
			.then(function() {
				$scope.removeFromModels([model]);
			}, handleException);	
		};

		$scope.onUpdateProp = function(model, prop, val) {
			//not changed
			if (model[prop] === val) {
				return;
			}

			model[prop] = val;

			$scope.resetValidation();

			apinetService.action({
				method: 'tasks/dictionary/editCustomStatus',
				project: sysConfig.project,
				model: model
			}).then(function(response) {
				if (response.validation.success) {
					angular.extend(model, response.model);
				} else {
					handleError(response.validation);
				}
			}, handleException);
		};

		$scope.requestParams = { project: sysConfig.project };
		$scope.editModel = {id: null, name: '', viewOrder: null};
		$scope.deleteModel = { replacementStatus: null };
}]);