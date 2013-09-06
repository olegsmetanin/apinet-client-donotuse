angular.module('home')
	.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function($stateProvider, sysConfig, securityAuthorizationProvider) {
			$stateProvider
				.state({
					name: 'page.projectList',
					url: '/projects/listview',
					views: {
						'content': {
							templateUrl: sysConfig.src('home/projects/listview/projectsList.tpl.html')
						}
					}
				})
				.state({
					name: 'page.projectStatus',
					url: '/projects/projectStatus',
					views: {
						'content': {
							templateUrl: sysConfig.src('home/projects/projectStatus/projectStatus.tpl.html')
						}
					}
				})
				.state({
					name: 'page.createProject',
					url: '/projects/createProject',
					views: {
						'content': {
							templateUrl: sysConfig.src('home/projects/createProject/createProject.tpl.html')
						}
					},
					resolve: {
						adminUser: securityAuthorizationProvider.requireAdminUser()
					}
				});
		}
	]);