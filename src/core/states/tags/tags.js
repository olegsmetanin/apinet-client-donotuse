define([
	'../../moduleDef',
	'angular',
	'text!./tags.tpl.html',
	'text!../moduleMenu.tpl.html'
], function (module, angular, tpl, menuTpl) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state({
			name: 'page.projects.tags',
			url: '/projects/tags',
			views: {
				'': { template: tpl, controller: 'tagsCtrl' },
				'moduleMenu@page': { template: menuTpl }
			},
			resolve: {
				tagTypes: function() { return [{id: 'core.project', code: 'projects.tags.type' }]; }
			},
			onEnter: ['$rootScope', function($rootScope) {
				$rootScope.breadcrumbs.push({
					name: 'projects.tags.title',
					url: 'page.projects.tags'
				});
			}],
			onExit: ['$rootScope', function($rootScope) {
				$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
			}]
		});
	}])
	.controller('tagsCtrl', ['$scope', '$window', 'i18n', 'apinetService', '$stateParams', 'tagTypes', 
		function($scope, $window, i18n, apinetService, $stateParams, tagTypes) {

			$scope.tagTypes = tagTypes;
			$scope.currentType = $scope.tagTypes.length > 0 ? $scope.tagTypes[0].id : null;
			$scope.page = 0;
			$scope.requestParams = { type: $scope.currentType ? $scope.currentType.id : null };//for row counter

			$scope.resetValidation = function() {
				if (!$scope.validation) {
					$scope.validation = {};
				}
				$scope.validation.generalErrors = [];
				$scope.validation.fieldErrors = {};
			};

			$scope.handleError = function(error) {
				$scope.resetValidation();
				$scope.validation.generalErrors = [error];
			};

			$scope.load = function() {
				apinetService.action({
					method: 'core/dictionary/getTags',
					project: $stateParams.project,
					type: $scope.currentType,
					page: $scope.page
				}).then(function(response){
					if(!response.length) {
						$scope.page--;
						if($scope.page < 0) {
							$scope.page = 0;
						}
					}
					$scope.models = $scope.models || [];
					for(var i = 0; i < response.length; i++) {
						$scope.models.push(response[i]);
					}
				}, function(error) {
					$scope.page--;
					if($scope.page < 0) {
						$scope.page = 0;
					}
					$scope.handleError(error);
				});
			};

			$scope.nextPage = function() {
				$scope.page++;
				$scope.load();
			};

			$scope.newTag = function(parent) {
				var newModel = {
					Name: i18n.msg('core.tags.newTag'),
					Parent: parent && parent.Id ? { Id: parent.Id } : null
				};

				if(!parent || !parent.Id) {
					$scope.models.unshift(newModel);
					return;
				}

				var index = $scope.models.indexOf(parent);
				if (index < 0) {
					return;
				}
				index++;

				if(index === $scope.models.length) {
					$scope.models.push(newModel);
				}
				else {
					$scope.models.splice(index, 0, newModel);
				}
			};

			$scope.onUpdate = function(model, name) {
				$scope.resetValidation();
				model.validation = {};

				if(model.Id) {
					$scope.updateTag(model, name);
				}
				else {
					$scope.createTag(model, name);
				}
			};

			$scope.onCancel = function(model) {
				model.validation = {};
			};

			$scope.createTag = function(model, name) {
				if(!name || !name.length) {
					return;
				}

				apinetService.action({
					method: 'core/dictionary/createTag',
					project: $stateParams.project,
					type: $scope.currentType,
					parentId: model.Parent && model.Parent.Id ? model.Parent.Id : null,
					name: name
				}).then(function(result) {
					if(result && !angular.isDefined(result.success)) {
						angular.extend(model, result);
					}
					else {
						model.validation = result || {};
					}
				}, $scope.handleError);
			};

			$scope.updateTag = function(model, name) {
				if(!model.Id || !name || !name.length) {
					return;
				}

				apinetService.action({
					method: 'core/dictionary/updateTag',
					project: $stateParams.project,
					type: $scope.currentType,
					id: model.Id,
					name: name
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
			
			$scope.deleteTag = function(model) {
				if(!model.Id) {
					//remove not stored model (without id)
					for(var i = 0; i < $scope.models.length; i++) {
						if($scope.models[i] === model) {
							$scope.models.splice(i, 1);
							break;
						}
					}
					return;
				}

				if (!$window.confirm(i18n.msg('core.confirm.delete.record'))) {
					return;
				}

				$scope.resetValidation();
				model.validation = {};

				apinetService.action({
					method: 'core/dictionary/deleteTag',
					project: $stateParams.project,
					type: $scope.currentType,
					id: model.Id
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
				}, $scope.handleError);
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

			$scope.$watch('currentType', function() {
				$scope.requestParams.type = $scope.currentType;
				$scope.load();
			});
	}]);
});
