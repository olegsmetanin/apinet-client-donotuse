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

			$stateProvider.state(documentsList);
		}
	])
	.controller('documentsListCtrl', ['$scope', 'documentsService', 'pageConfig', 'sysConfig', 'promiseTracker',
		function($scope, $documentsService, $pageConfig, sysConfig, promiseTracker) {
			$pageConfig.setConfig({
				breadcrumbs: [{
					name: 'Documents',
					url: '/#!/documents/listview'
				}]
			});

			angular.extend($scope, {
				documents: [],
				filter: {
					simple: {},
					complex: {},
					user: {}
				},
				applyEnabled: false,
				selectedDocumentId: null,
				documentDetailsTemplate: null,
				loading: promiseTracker('documents'),

				refreshList: function() {
					$documentsService.getDocuments({
						filter: $scope.filter
					})
					.then(function(result) {
						$scope.documents = result.rows;
						$scope.applyEnabled = false;
					});
				}
			});

			$scope.$watch('filter', function(value) {
				$scope.applyEnabled = true;
				console.log('filter', value);
			}, true);

			$scope.refreshList();
		}
	]);