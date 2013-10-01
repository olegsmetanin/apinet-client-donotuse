angular.module('home')
	.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function($stateProvider, sysConfig, securityAuthorizationProvider) {
			$stateProvider.state({
				name: 'page.projectTags',
				url: '/projects/tags',
				resolve: {
					pageConfig: 'pageConfig',
					promiseTracker: 'promiseTracker',
					apinetService: 'apinetService',
					currentUser: securityAuthorizationProvider.requireAuthenticatedUser()
				},
				onEnter: function(pageConfig) {
					pageConfig.setConfig({
						breadcrumbs: [
							{
								name: 'Projects',
								url: '/#!/projects/listview'
							},
							{
								name: 'Tags' ,
								url: '/#!/projects/tags'
							}
						]
					});
				},
				views: {
					'content': {
						templateUrl: sysConfig.src('home/projects/tags/projectTags.tpl.html'),
						controller: function($scope, currentUser) {
							$scope.currentUser = currentUser;
						}
					}
				}
			});
		}
	])
	.controller('projectTagsCtrl', ['$scope', 'apinetService', '$window',
		function($scope, apinetService, $window) {
			angular.extend($scope, {
				requestParams: { mode: 'Personal' },
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
					if (!$window.confirm('Вы действительно хотите удалить записи?')) {
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
		}]);