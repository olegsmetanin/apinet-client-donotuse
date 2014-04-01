define([
	'../../moduleDef',
	'angular',
	'text!./customPropTypes.tpl.html',
	'../page'
], function (module, angular, template) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state({
			name: 'page.project.customPropTypes',
			abstract: true,
			views: {
				'': { template: template }
				//menu will be applied in modules
			},
			onExit: function($rootScope) {
				$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
			}
		});
	}])
	.controller('customPropTypesController', ['$scope', 'apinetService', 'i18n', '$stateParams', '$window',
		function($scope, apinetService, i18n, $stateParams, $window) {
			var handleException = function(error) {
				$scope.resetValidation();
				$scope.validation.generalErrors = angular.isArray(error) ? error : [error];
			};

			$scope.newParamType = {
				parent: null,
				name: null,
				type: null,
				format: null,

				clear: function() {
					//this.parent = null;
					this.name = null;
					// this.type = null;
					this.format = null;
				}
			};

			$scope.create = function() {
				var model = {
					Name: $scope.newParamType.name,
					ParentId: $scope.newParamType.parent ? $scope.newParamType.parent.id : null,
					ValueType: $scope.newParamType.type.id,
					Format: $scope.newParamType.format
				};

				apinetService.action({
					method: 'core/dictionary/createCustomPropertyType',
					project: $stateParams.project,
					model: model
				}).then(function(result) {
					if(result && !angular.isDefined(result.success)) {
						$scope.models.push(result);
						$scope.toggleCreateForm(false);
						$scope.newParamType.clear();
					}
					else {
						$scope.validation = result || {};
					}
				}, handleException);
			};

			$scope.delete = function(paramType) {
				if (!$window.confirm(i18n.msg('core.confirm.delete.record'))) {
					return;
				}

				apinetService.action({
					method: 'core/dictionary/deleteCustomPropertyType',
					project: $stateParams.project,
					id: paramType.Id
				}).then(function(result) {
					if(result && !angular.isDefined(result.success)) {
						if(angular.isArray(result)) {
							for(var i = 0; i < result.length; i++) {
								$scope.removeDeletedModel(result[i]);
							}
						}
					}
					else {
						model.validation = result || {};
					}
				}, handleException);
			};

			$scope.updateProp = function(model, prop, val) {
				var arg = {
					Id: model.Id,
					ModelVersion: model.ModelVersion,
					Prop: prop,
					Value: val
				};

				return apinetService.action({
					method: 'core/dictionary/updateCustomPropertyType',
					project: $stateParams.project,
					data: arg
				}).then(function(result) {
					if(result && !angular.isDefined(result.success)) {
						if(angular.isArray(result)) {
							for(var i = 0; i < result.length; i++) {
								$scope.extendUpdatedModel(result[i]);
							}
						}
					}
					else {
						model.validation = result || {};
					}
				}, $scope.handleError);
			};

			$scope.onCancel = function(model) {
				model.validation = {};
			};

			$scope.extendUpdatedModel = function(updatedModel) {
				for(var i = 0; i < $scope.models.length; i++) {
					if($scope.models[i].Id === updatedModel.Id) {
						angular.extend($scope.models[i], updatedModel);
						break;
					}
				}
			};

			$scope.removeDeletedModel = function(id) {
				for(var i = 0; i < $scope.models.length; i++) {
					if($scope.models[i].Id === id) {
						$scope.models.splice(i, 1);
						break;
					}
				}
			};

			$scope.toggleCreateForm = function(visible) {
				$scope.createFormVisible = visible;
			};
		}]
	);
});
