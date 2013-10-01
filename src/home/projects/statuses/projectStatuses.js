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
	.controller('projectStatusesCtrl', ['$scope', 'apinetService', '$window',
		function($scope, apinetService, $window) {
			angular.extend($scope, {
				requestParams: { },
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
						method: 'home/dictionary/deleteProjectStatus',
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
						$scope.validation.generalErrors = [ error ];
					});
				},

				cancelEdit: function() {
					$scope.editFormVisible = false;
				}
			});
		}]);