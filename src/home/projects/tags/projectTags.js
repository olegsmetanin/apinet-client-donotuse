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
	.controller('projectTagsCtrl', ['$scope', 'promiseTracker', 'apinetService', '$window',
		function($scope, promiseTracker, apinetService, $window) {
			angular.extend($scope, {
				loading: promiseTracker('projects'),
				requestParams: { mode: 'Personal' },
				editFormVisible: false,
				editingItem: {},
				validation: {
					generalError: null,
					fieldErrors: {}
				},

				newItem: function() {
					$scope.validation.generalError = null;
					$scope.validation.fieldErrors = {};

					$scope.editingItem = {};
					$scope.editFormVisible = true;
				},

				editItem: function(item) {
					$scope.validation.generalError = null;
					$scope.validation.fieldErrors = {};

					$scope.editingItem = angular.extend({}, item);
					$scope.editFormVisible = true;
				},

				deleteItem: function(item) {
					if (!$window.confirm('Вы действительно хотите удалить записи?')) {
						return;
					}

					$scope.validation.generalError = null;
					$scope.validation.fieldErrors = {};

					apinetService.action({
						method: 'home/dictionary/deleteProjectTag',
						id: item.Id
					})
					.then(function() {
						$scope.refreshList();
						$scope.cancelEdit();
					}, function(error) {
						$scope.validation.generalError = error;
					});
				},

				saveItem: function() {
					$scope.validation.generalError = null;
					$scope.validation.fieldErrors = {};

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
							$scope.validation.generalError = error;
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