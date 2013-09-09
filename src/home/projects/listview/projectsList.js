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
				onEnter: function(pageConfig) {
					pageConfig.setConfig({
						breadcrumbs: [{
							name: 'Projects',
							url: '/#!/projects/listview'
						}]
					});
				},
				views: {
					'content': {
						templateUrl: sysConfig.src('home/projects/listview/projectsList.tpl.html'),
						controller: function($scope, promiseTracker, currentUser) {
							angular.extend($scope, {
								loading: promiseTracker('projects'),
								currentUser: currentUser
							});
						}
					}
				}
			});
		}
	]);