define(['angular', '../../moduleDef', 'text!./projectStatuses.tpl.html', '../projects'],
	function (angular, module, tpl) {
		module.config(['$stateProvider', function($stateProvider) {
			$stateProvider.state({
				name: 'page.projects.projectStatuses',
				url: '/projects/statuses',
				onEnter: function(pageConfig, i18n) {
					pageConfig.setConfig({
						breadcrumbs: [
							{ name: i18n.msg('projects.list.title'), url: '/#!/projects/listview' },
							{ name: i18n.msg('projects.statuses.title'), url: '/#!/projects/statuses' }
						]
					});
				},
				template: tpl
			});
		}])
		.controller('projectStatusesCtrl', ['$scope', 'sysConfig', 'apinetService', '$window', 'i18n',
			function($scope, sysConfig, apinetService, $window, i18n) {
				angular.extend($scope, {
					createItemForm: { },
					editModel: { },
					deleteModel: { },
					validation: { },

					handleException: function(error) {
						$scope.resetValidation();
						$scope.validation.generalErrors = [error];
					},

					handleValidationErrors: function(validation) {
						$scope.resetValidation();
						angular.extend($scope.validation, validation);
					},

					removeModels: function(modelsToRemove) {
						for(var i = 0; i < modelsToRemove.length; i++) {
							var index = $scope.models.indexOf(modelsToRemove[i]);
							if (index === -1) {
								continue;
							}
							$scope.models.splice(index, 1);
						}
					},

					createItem: function() {
						$scope.resetValidation();
						delete $scope.editModel.id;

						apinetService.action({
							method: 'home/dictionary/editProjectStatus',
							project: sysConfig.project,
							model: $scope.editModel
						}).then(function(result) {
							if(typeof result.success === 'undefined' || result.success) {
								$scope.dropChanges();
								$scope.models.unshift(result);
							}
							else {
								$scope.handleValidationErrors(result);
							}
						}, $scope.handleException);
					},

					dropChanges: function() {
						$scope.resetValidation();
						$scope.editModel = { };
						$scope.createItemForm.$setPristine();
						$scope.createItemForm.$setValidity('integer', true);
					},

					createEnabled: function() {
						return $scope.createItemForm.$valid &&
							(typeof $scope.validation.success === 'undefined' || $scope.validation.success);
					},

					hasSelected: function() {
						for(var i = 0; i < $scope.models.length; i++) {
							if ($scope.models[i].selected && $scope.models[i].selected === true) {
								return true;
							}
						}

						return false;
					},

					deleteItem: function(model) {
						if (!model) {
							return;
						}
						if (!$window.confirm(i18n.msg('core.confirm.delete.record'))) {
							return;
						}

						$scope.resetValidation();

						apinetService.action({
							method: 'home/dictionary/deleteProjectStatuses',
							project: sysConfig.project,
							ids: [ model.Id ],
							replaceId: $scope.deleteModel.replacementItem ? $scope.deleteModel.replacementItem.id : null
						}).then(function() {
							$scope.removeModels([model]);
						}, $scope.handleException);
					},

					deleteSelected: function() {
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

						apinetService.action({
							method: 'home/dictionary/deleteProjectStatuses',
							project: sysConfig.project,
							ids: ids,
							replaceId: $scope.deleteModel.replacementItem ? $scope.deleteModel.replacementItem.id : null
						}).then(function() {
							$scope.removeModels(modelsToRemove);
						}, $scope.handleException);
					},

					onUpdateProp: function(model, prop, val) {
						$scope.resetValidation();

						var data = {
							Id: model.Id,
							Name: model.Name,
							Description: model.Description,
							ModelVersion: model.ModelVersion
						};
						data[prop] = val;

						return apinetService.action({
							method: 'home/dictionary/editProjectStatus',
							project: sysConfig.project,
							model: data
						}).then(function(result) {
							var success = typeof result.success === 'undefined' || result.success;
							if(success) {
								angular.extend(model, result);
								model.validation = {};
							}
							else {
								model.validation = result;
							}
							return success;
						}, $scope.handleException);
					},

					onCancel: function(model) {
						model.validation = {};
					}
				});
			}]);
});