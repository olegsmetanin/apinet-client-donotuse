define([
	'../../moduleDef',
	'../../../components/angular-infrastructure',
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
							{ name: i18n.msg('projects.list.title'), url: '/#!/projects/listview' },
							{ name: i18n.msg('projects.tags.title'), url: '/#!/projects/tags' }
						]
					});
				},
				template: tpl
			});
		}])
		.controller('projectTagsCtrl', ['$scope', 'apinetService', '$window', 'i18n',
			function($scope, apinetService, $window, i18n) {
				angular.extend($scope, {
					editFormVisible: false,
					editingItem: {},

					newItem: function() {
						$scope.resetValidation();
						$scope.editingItem = {};
						$scope.editFormVisible = true;
					},

					editItem: function(item) {
						$scope.resetValidation();
						$scope.editingItem = angular.extend({}, item);
						$scope.editFormVisible = true;
					},

					deleteItem: function(item) {
						if (!$window.confirm(i18n.msg('core.confirm.delete.records'))) {
							return;
						}

						$scope.resetValidation();

						apinetService.action({
							method: 'home/dictionary/deleteProjectTag',
							id: item.Id
						})
						.then(function() {
							$scope.cancelEdit();
							var index = $scope.models.indexOf(item);
							if(index === -1) {
								return;
							}
							$scope.models.splice(index, 1);
						}, function(error) {
							$scope.validation.generalErrors = [ error ];
						});
					},

					saveItem: function() {
						$scope.resetValidation();

						apinetService.action(angular.extend({
							method: 'home/dictionary/editProjectTag',
							model: $scope.editingItem
						}, $scope.requestParams))
						.then(function(result) {
							if(result.success) {
								$scope.refreshList();
								$scope.cancelEdit();
							}
							else {
								angular.extend($scope.validation, result);
							}
						}, function(error) {
							$scope.validation.generalErrors = [ error ];
						});
					},

					cancelEdit: function() {
						$scope.editFormVisible = false;
					}
				});

				$scope.$watch('requestParams', function() {
					$scope.cancelEdit();
				}, true);

				$scope.$on('resetFilter', function() {
					$scope.filter.simple = { Ownership: 'Personal' };
					$scope.requestParams.mode = 'Personal';
				});

				$scope.$watch('filter.simple.Ownership', function(value) {
					$scope.requestParams.mode = value || 'Personal';
				}, true);
			}]);
});