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
	.controller('documentsListCtrl', ['$scope', 'pageConfig', 'sysConfig', 'promiseTracker',
		function($scope, $pageConfig, sysConfig, promiseTracker) {
			$pageConfig.setConfig({
				breadcrumbs: [{
					name: 'Documents',
					url: '/#!/documents/listview'
				}]
			});

			$scope.loading = promiseTracker('documents');
		}
	]);