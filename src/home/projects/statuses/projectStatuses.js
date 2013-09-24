angular.module('home')
	.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function($stateProvider, sysConfig, securityAuthorizationProvider) {
			$stateProvider.state({
				name: 'page.projectStatuses',
				url: '/projects/statuses',
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
								name: 'Statuses' ,
								url: '/#!/projects/statuses'
							}
						]
					});
				},
				views: {
					'content': {
						templateUrl: sysConfig.src('home/projects/statuses/projectStatuses.tpl.html'),
						controller: function($scope, currentUser) {
							$scope.currentUser = currentUser;
						}
					}
				}
			});
		}
	])
	.controller('projectStatusesCtrl', ['$scope', 'promiseTracker', 'apinetService', '$window',
		function($scope, promiseTracker, apinetService, $window) {
			angular.extend($scope, {
				loading: promiseTracker('projects'),
				requestParams: { },
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
						method: 'home/dictionary/deleteProjectStatus',
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

					apinetService.action({
						method: 'home/dictionary/editProjectStatus',
						model: $scope.editingItem
					})
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
		}]);