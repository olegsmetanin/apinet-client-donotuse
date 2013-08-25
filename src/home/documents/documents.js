angular.module('home')
	.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig', 'securityAuthorizationProvider',
		function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig, securityAuthorizationProvider) {

			var documentsList = {
				name: 'page.documentList',
				url: '/documents/listview',
				views: {
					'content': {
						templateUrl: sysConfig.src('home/documents/listview/documentsList.tpl.html')
					}
				},
				resolve: {
				//	role: securityAuthorizationProvider.requireRoles(['admin', 'manager', 'executor'])
				}
			};

			$stateProvider
				.state(documentsList);

		}
	])
	.controller('documentsListCtrl', ['$scope', 'documentsService', 'pageConfig', 'sysConfig', 'promiseTracker', 'reportService',
		function($scope, $documentsService, $pageConfig, sysConfig, promiseTracker, reportService) {
			angular.extend($scope, {
				documents: [],
				structuredFilter: {},
				userFilter: {},
				applyEnabled: false,
				selectedDocumentId: null,
				documentDetailsTemplate: null,
				loading: promiseTracker('documents'),

				refreshList: function() {
					var filter = {
						op: '&&',
						items: []
					};

					if ($scope.structuredFilter.items && $scope.structuredFilter.items.length) {
						filter.items.push($scope.structuredFilter);
					}
					if ($scope.userFilter.items && $scope.userFilter.items.length) {
						filter.items.push({
							path: 'CustomProperties',
							op: '&&',
							items: $scope.userFilter.items
						});
					}

					$documentsService.getDocuments({
						filter: filter
					})
						.then(function(result) {
							$scope.documents = result.rows;
							$scope.applyEnabled = false;
						});
				},

				generateReport: function() {
					reportService.generate({
						action: "generate",
						model: "Document",
						filter: {},
						name: "report" + new Date()
					});
				}
			});

			$pageConfig.setConfig({
				breadcrumbs: [{
					name: 'Documents',
					url: '/#!/documents/listview'
				}]
			});

			$scope.$watch('structuredFilter', function() {
				$scope.applyEnabled = true;
			}, true);

			$scope.$watch('userFilter', function() {
				$scope.applyEnabled = true;
			}, true);

			$scope.refreshList();
		}
	]);