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
		.controller('projectTagsCtrl', ['$scope', 'apinetService',
			function($scope, apinetService) {
				$scope.loadTags = function(parentId, deferred) {
					console.log('loadTags', parentId, deferred);

					if(!parentId) {
						return;
					}

					apinetService.getModels({
						method: 'core/dictionary/getProjectTags',
						parentId: parentId,
						filter: [],
						sorters: [],
						page: 0
					}).then(function(result) {
						deferred.resolve(result || []);
					}, function(error) {
						deferred.reject(error);
					});
				};

				/*$scope.loadRootTags = function(parentId, deferred) {
					$scope.models = [];

					var generalErrorsUnwatch = $scope.$watch('validation.generalErrors', function(value, oldValue) {
						if(value === oldValue) {
							return;
						}
						if(angular.isFunction(generalErrorsUnwatch)) {
							generalErrorsUnwatch();
						}
						if(angular.isArray(value)) {
							deferred.reject(value);
						}
					}, true);

					var unwatch = $scope.$watch('models', function(value, oldValue) {
						if(value === oldValue) {
							return;
						}
						if(angular.isFunction(unwatch)) {
							unwatch();
						}
						if(angular.isArray(value)) {
							deferred.resolve(value);
						}
						else {
							deferred.reject(['Unknown error']);
						}
					}, true);

					$scope.refreshList();
				};

				$scope.loadChildrenTags = function(parentId, deferred) {
					console.log('loadChildrenTags', parentId);

					apinetService.getModels({
						method: 'core/dictionary/getProjectTags',
						parentId: parentId,
						filter: [],
						sorters: [],
						page: 0
					}).then(function(result) {
						deferred.resolve(result || []);
					}, function(error) {
						deferred.reject(error);
					});
				};*/

				$scope.createTag = function(parentId, name, deferred) {
					console.log('createTag', parentId, name);

					if(!name || !name.length) {
						return;
					}

					apinetService.action({
						method: 'core/dictionary/createProjectTag',
						parentId: parentId,
						name: name
					}).then(function(result) {
						if(result && !angular.isDefined(result.success)) {
							deferred.resolve(result);
						} else {
							deferred.reject(result);
						}
					}, function(error) {
						deferred.reject({
							generalErrors: [error],
							success: false
						});
					});
				};

				$scope.updateTag = function(id, name, deferred) {
					if(!id || !id.length || !name || !name.length) {
						return;
					}

					apinetService.action({
						method: 'core/dictionary/updateProjectTag',
						id: id,
						name: name
					}).then(function(result) {
						if(result && !angular.isDefined(result.success)) {
							deferred.resolve(result);
						} else {
							deferred.reject(result);
						}
					}, function(error) {
						deferred.reject({
							generalErrors: [error],
							success: false
						});
					});
				};

				$scope.deleteTag = function(id, deferred) {
					if(!id || !id.length) {
						return;
					}

					apinetService.action({
						method: 'core/dictionary/deleteProjectTag',
						id: id
					}).then(function(result) {
						if(result && result.success) {
							deferred.resolve(id);
						} else {
							deferred.reject(result);
						}
					}, function(error) {
						deferred.reject({
							generalErrors: [error],
							success: false
						});
					});
				};
			}]);
});