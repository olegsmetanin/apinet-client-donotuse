angular.module('tasks')
	.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig',
		'securityAuthorizationProvider',
		function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig, securityAuthorizationProvider) {

		var home = {
				name: 'page1C.home',
				url: '',
				views: {
					'content': {
						templateUrl: sysConfig.src('tasks/task/taskList.tpl.html'),
						controller: 'taskListCtrl'
					}
				},
				resolve: {
					pageConfig: 'pageConfig',
					promiseTracker: 'promiseTracker',
					authUser: securityAuthorizationProvider.requireAuthenticatedUser()
				},
				onEnter: function(pageConfig) {
					pageConfig.setConfig({
						breadcrumbs: [{
							name: 'Tasks',
							url: '/#!/'
						}]
					});
				}
			};

			var root = {
				name: 'page1C.root',
				url: '/',
				views: {
					'content': {
						templateUrl: sysConfig.src('tasks/task/taskList.tpl.html'),
						controller: 'taskListCtrl'
					}
				},
				resolve: {
					pageConfig: 'pageConfig',
					promiseTracker: 'promiseTracker',
					authUser: securityAuthorizationProvider.requireAuthenticatedUser()
				},
				onEnter: function(pageConfig) {
					pageConfig.setConfig({
						breadcrumbs: [{
							name: 'Tasks',
							url: '/#!/'
						}]
					});
				}
			};

			var tasks = {
				name: 'page1C.tasks',
				url: '/tasks',
				views: {
					'content': {
						templateUrl: sysConfig.src('tasks/task/taskList.tpl.html'),
						controller: 'taskListCtrl',
					}
				},
				resolve: {
					pageConfig: 'pageConfig',
					promiseTracker: 'promiseTracker',
					authUser: securityAuthorizationProvider.requireAuthenticatedUser()
				},
				onEnter: function(pageConfig) {
					pageConfig.setConfig({
						breadcrumbs: [{
							name: 'Tasks',
							url: '/#!/tasks'
						}]
					});
				}
			};

			$stateProvider.state(home);
			$stateProvider.state(root);
			$stateProvider.state(tasks);
		}
	])
	.controller('taskListCtrl', ['$scope', function($scope){
		$scope.msg = 'Welcom to tasks module';
	}]);