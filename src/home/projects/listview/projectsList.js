angular.module('home')
	.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function($stateProvider, sysConfig, securityAuthorizationProvider) {
			$stateProvider.state({
				name: 'page.projectList',
				url: '/projects/listview',
				resolve: {
					pageConfig: 'pageConfig',
					promiseTracker: 'promiseTracker',
					currentUser: securityAuthorizationProvider.requireAuthenticatedUser()
				},
				onEnter: function(pageConfig, i18n) {
					pageConfig.setConfig({
						breadcrumbs: [{
							name: i18n.msg('projects.list.title'),
							url: '/#!/projects/listview'
						}]
					});
				},
				views: {
					'content': {
						templateUrl: sysConfig.src('home/projects/listview/projectsList.tpl.html'),

						controller: function($scope, currentUser) {
							$scope.currentUser = currentUser;
						}
					}
				}
			});
		}
	])
	.controller('projectsListCtrl', ['$scope', function($scope) {
		angular.extend($scope, {
			requestParams: { mode: 'All' }
		});
	}]);