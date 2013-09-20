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
						controller: function($scope, promiseTracker, apinetService, currentUser) {
							angular.extend($scope, {
								loading: promiseTracker('projects'),
								currentUser: currentUser,
								requestParams: { },
								editFormVisible: false,
								editingItem: {},
								validation: {
									generalError: null,
									fieldErrors: {}
								},

								totalRowsCount: 0,
								gridOptions: {
									data: 'models',
									gridRows: [],
									totalServerItems: 'totalRowsCount',
									enablePaging: true,
									showFooter: true,
									pagingOptions: {
										pageSizes: [10, 25, 50, 100],
										pageSize: 10,
										currentPage: 1
									},
									sortInfo: { columns: [], fields: [], directions: [] },
									useExternalSorting: true,

									columnDefs: [
										{ field: "Name", displayName: 'Наименование' },
										{ field: "Description", displayName: 'Описание' },
										{ field: "CreationTime", displayName: 'Дата создания', cellFilter: "date:'dd.MM.yyyy hh:mm'" }
									]
								},

								newItem: function() {
									$scope.editingItem = {};
									$scope.editFormVisible = true;
								},

								editItem: function(item) {
									$scope.editingItem = item;
									$scope.editFormVisible = true;
								},

								deleteItem: function(item) {
									apinetService.action({
										method: 'home/dictionary/deleteProjectStatus',
										id: item.Id
									})
									.then(function() {
										$scope.$broadcast('refreshList');
									}, function(error) {
										$scope.validation.generalError = error;
									});
								},

								saveItem: function() {
									apinetService.action({
										method: 'home/dictionary/editProjectStatus',
										model: $scope.editingItem
									})
									.then(function(result) {
										if(result.success) {
											$scope.$broadcast('refreshList');
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
						}
					}
				}
			});
		}
	]);