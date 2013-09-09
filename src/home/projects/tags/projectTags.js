angular.module('home')
	.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function($stateProvider, sysConfig, securityAuthorizationProvider) {
			$stateProvider.state({
				name: 'page.projectTags',
				url: '/projects/tags',
				resolve: {
					pageConfig: 'pageConfig',
					promiseTracker: 'promiseTracker',
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