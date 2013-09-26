angular.module('tasks')
	.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig', 'securityAuthorizationProvider',
		function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig, securityAuthorizationProvider) {

		var home = {
				name: 'page.home',
				url: '',
				views: {
					'content': {
						templateUrl: sysConfig.src('tasks/task/taskList.tpl.html')
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

			var root = angular.copy(home);
			root.name = 'page.root';
			root.url = '/';

			var tasks = angular.copy(home);
			tasks.name = 'page.tasks';
			tasks.url = '/tasks';

			$stateProvider.state(home);
			$stateProvider.state(root);
			$stateProvider.state(tasks);
		}
	])
	.controller('taskListCtrl', ['$scope', 'promiseTracker', 'sysConfig', 'apinetService', '$window', '$timeout', 
		function($scope, promiseTracker, sysConfig, apinetService, $window, $timeout) {
		$scope.loading = promiseTracker('tasks');
		$scope.requestParams = { project: sysConfig.project };
	}]);