define([
	'../../moduleDef',
	'angular',
	'text!./projectTags.tpl.html',
	'../projects'
], function (module, angular, tpl) {
		module.config(['$stateProvider', function($stateProvider) {
			$stateProvider.state({
				name: 'page.projects.projectTags',
				url: '/projects/tags',
				onEnter: function(pageConfig, i18n) {
					pageConfig.setConfig({
						breadcrumbs: [
							{ name: i18n.msg('projects.list.title'), url: 'page.projects.projectsList' },
							{ name: i18n.msg('projects.tags.title'), url: 'page.projects.projectTags' }
						]
					});
				},
				template: tpl
			});
		}])
		.controller('projectTagsCtrl', ['$scope', '$window', 'i18n', 'apinetService', function($scope, $window, i18n, apinetService) {
			angular.extend($scope, {
				handleError: function(error) {
					$scope.resetValidation();
					$scope.validation.generalErrors = [error];
				},

				newTag: function(parent) {
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
				},

				onUpdate: function(model, name) {
					$scope.resetValidation();
					model.validation = {};

					if(model.Id) {
						$scope.updateTag(model, name);
					}
					else {
						$scope.createTag(model, name);
					}
				},

				onCancel: function(model) {
					model.validation = {};
				},

				createTag: function(model, name) {
					if(!name || !name.length) {
						return;
					}

					apinetService.action({
						method: 'core/dictionary/createProjectTag',
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
				},

				updateTag: function(model, name) {
					if(!model.Id || !name || !name.length) {
						return;
					}

					apinetService.action({
						method: 'core/dictionary/updateProjectTag',
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
				},

				deleteTag: function(model) {
					if(!model.Id) {
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
						method: 'core/dictionary/deleteProjectTag',
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
				},

				extendUpdatedModel: function(updatedModel) {
					for(var i = 0; i < $scope.models.length; i++) {
						if($scope.models[i].Id === updatedModel.Id) {
							angular.extend($scope.models[i], updatedModel);
							break;
						}
					}
				},

				removeDeletedModel: function(id) {
					for(var i = 0; i < $scope.models.length; i++) {
						if($scope.models[i].Id === id) {
							$scope.models.splice(i, 1);
							break;
						}
					}
				}
			});
		}]);
});