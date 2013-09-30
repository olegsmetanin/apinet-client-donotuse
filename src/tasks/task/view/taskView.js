angular.module('tasks')
.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig', 'securityAuthorizationProvider',
	function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig, securityAuthorizationProvider) {

	var taskView = {
			name: 'page.tastView',
			url: '/tasks/:num',
			views: {
				'content': {
					templateUrl: sysConfig.src('tasks/task/view/taskView.tpl.html')
				}
			},
			resolve: {
				pageConfig: 'pageConfig',
				currentUser: securityAuthorizationProvider.requireAuthenticatedUser()
			},
			onEnter: ['pageConfig', '$stateParams', function(pageConfig, $stateParams) {
				pageConfig.setConfig({
					breadcrumbs: [
						{ name: 'Tasks', url: '#!/' },
						{ name: $stateParams.num, url: '#!/tasks/' + $stateParams.num }]
				});
			}]
		};

		$stateProvider.state(taskView);
	}
])
.controller('taskViewCtrl', ['$scope', 'sysConfig', 'apinetService', '$window', '$timeout', '$stateParams', 'helpers',
	function($scope, sysConfig, apinetService, $window, $timeout, $stateParams, helpers) {

		$scope.changeStatus = function(hrecord) {
			console.log('Change status for %s', hrecord.Text);
		};

		$scope.changeCustomStatus = function(hrecord) {
			console.log('Change custom status for %s', hrecord.Text);
		};

		apinetService.action({
			method: 'tasks/tasks/GetTask',
			project: sysConfig.project,
			numpp: $stateParams.num })
		.then(function(response) {
			$scope.model = response;
		}, function(error) {
			//TODO
			console.log(error);
		});
}]);