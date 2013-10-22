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
				i18n: 'i18n',
				pageConfig: 'pageConfig',
				authUser: securityAuthorizationProvider.requireAuthenticatedUser()
			},
			onEnter: function(pageConfig, i18n) {
				pageConfig.setConfig({
					menu: 'tasks.dictionary.statuses',
					breadcrumbs: [
						{ name: i18n.msg('tasks.list.title'), url: '#!/' },
						{ name: i18n.msg('tasks.customStatuses.title'), url: '#!/dictionary/statuses' }]
				});
			}
		};

		$stateProvider.state(statuses);
	}
])
.controller('customStatusCtrl', ['$scope', 'sysConfig', 'apinetService', '$window', 'i18n', '$timeout',
	function($scope, sysConfig, apinetService, $window, i18n, $timeout) {
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
				if (index < 0) {
					continue;
				}
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
					$scope.dropChanges();
					$scope.models.unshift(result.model);
				} else {
					handleError(result.validation);
				}
			}, handleException);
		};

		$scope.dropChanges = function() {
			$scope.resetValidation();
			$scope.editModel.name = '';
			$scope.editModel.viewOrder = null;
			$scope.editModel.focused = false;
			//$scope.createStatusForm.$setValidity('integer', true);
			$scope.createStatusForm.$setPristine();
			$scope.createStatusForm.$setValidity('integer', true);
		};

		$scope.isViewOrderInvalid = function() {
			var f = $scope.createStatusForm;
			return f.viewOrder.$dirty && !f.viewOrder.$valid;
		};

		$scope.createEnabled = function() {
			var f = $scope.createStatusForm;
			return $scope.editModel.name && $scope.editModel.viewOrder && f.viewOrder.$error.integer === false;
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
			if (!$window.confirm(i18n.msg('core.confirm.delete.records'))) {
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
			if (!$window.confirm(i18n.msg('core.confirm.delete.record'))) {
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
			$scope.resetValidation();

			var data = {
				Id: model.Id,
				Name: model.Name,
				ViewOrder: model.ViewOrder,
				ModelVersion: model.ModelVersion
			};
			data[prop] = val;
			return apinetService.action({
				method: 'tasks/dictionary/editCustomStatus',
				project: sysConfig.project,
				model: data
			}).then(function(response) {
				if (response.validation.success) {
					angular.extend(model, response.model);
					model.validation = {};
				} else {
					model.validation = response.validation;
				}
				return response.validation.success;
			}, handleException);
		};

		$scope.onCancel = function(model, val) {
			model.validation = {};
		};

		$scope.editModel = {id: null, name: '', viewOrder: null, focused: false};
		$scope.deleteModel = { replacementStatus: null };
		$timeout(function(){ $scope.createStatusForm.$setPristine(); }, 100);
}]);