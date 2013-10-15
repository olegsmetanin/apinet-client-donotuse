angular.module('home')
	.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function($stateProvider, sysConfig, securityAuthorizationProvider) {
			$stateProvider.state({
				name: 'page.projectStatuses',
				url: '/projects/statuses',
				resolve: {
					i18n: 'i18n',
					pageConfig: 'pageConfig',
					promiseTracker: 'promiseTracker',
					apinetService: 'apinetService',
					currentUser: securityAuthorizationProvider.requireAuthenticatedUser()
				},
				onEnter: function(pageConfig, i18n) {
					pageConfig.setConfig({
						breadcrumbs: [
							{
								name: i18n.msg('projects.list.title'),
								url: '/#!/projects/listview'
							},
							{
								name: i18n.msg('projects.statuses.title'),
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
	.controller('projectStatusesCtrl', ['$scope', 'apinetService', '$window', 'i18n',
		function($scope, apinetService, $window, i18n) {
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
					if (!$window.confirm(i18n.msg('core.confirm.delete.records'))) {
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