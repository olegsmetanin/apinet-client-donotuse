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
						controller: function($scope, promiseTracker, apinetService, currentUser) {
							angular.extend($scope, {
								loading: promiseTracker('projects'),
								currentUser: currentUser,
								requestParams: { mode: 'Personal' },
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
										{ field: "FullName", displayName: 'Полное наименование' },
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
										method: 'home/dictionary/deleteProjectTag',
										id: item.Id
									})
									.then(function() {
										$scope.$broadcast('refreshList');
									}, function(error) {
										//TODO: Global message box
										console.log(error);
									});
								},

								saveItem: function() {
									apinetService.action(angular.extend({
										method: 'home/dictionary/editProjectTag',
										model: $scope.editingItem
									}, $scope.requestParams))
									.then(function(result) {
										if(result.success) {
											$scope.$broadcast('refreshList');
											$scope.cancelEdit();
										}
										else {
											angular.extend($scope.validation, result);
										}
									}, function(error) {
										//TODO: Global message box
										console.log(error);
									});
								},

								cancelEdit: function() {
									$scope.editFormVisible = false;
								}
							});

							$scope.$watch('requestParams', function() {
								$scope.editFormVisible = false;
							}, true);
						}
					}
				}
			});
		}
	]);