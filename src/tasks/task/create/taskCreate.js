angular.module('tasks')
.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig', 'securityAuthorizationProvider',
	function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig, securityAuthorizationProvider) {

	var tastCreate = {
			name: 'page.tastCreate',
			url: '/tasks/new',
			views: {
				'content': {
					templateUrl: sysConfig.src('tasks/task/create/taskCreate.tpl.html')
				}
			},
			resolve: {
				pageConfig: 'pageConfig',
				currentUser: securityAuthorizationProvider.requireAuthenticatedUser()
				//, projectMember: securityAuthorizationProvider.requireGroups(['admins', 'managers'])
			},
			onEnter: function(pageConfig) {
				pageConfig.setConfig({
					breadcrumbs: [
						{ name: 'Tasks', url: '#!/' },
						{ name: 'New', url: '#!/tasks/new' } ]
				});
			}
		};

		$stateProvider.state(tastCreate);
	}
])
.controller('taskCreateCtrl', ['$scope', 'sysConfig', 'apinetService', '$window', '$timeout', '$state', 
	function($scope, sysConfig, apinetService, $window, $timeout, $state) {

		$scope.cancel = function() {
			$state.transitionTo('page.root', {}, true);
		};

		$scope.create = function() {
			var req = modelToRequest();
			apinetService.action({
				method: 'tasks/tasks/createTask',
				project: sysConfig.project,
				model: req })
			.then(function(response) {
				if (response.success) {
					if ($scope.nextAction === 'goToTask') {
						$state.transitionTo('page.taskView', {num: response.model}, true);
					} else if ($scope.nextAction === 'goToList') {
						$state.transitionTo('page.root', {}, true)
					} else if ($scope.nextAction === 'stayHere') {
						$scope.model = initModel();
						$scope.form.$setPristine();
					}
				} else {
					resetValidation();
					angular.extend($scope.validation, response);
				}
			}, function(error) {
				resetValidation();
				$scope.validation.generalErrors.push(error);
			});
		};

		$scope.priorities = [
			{name: 'Низкий', value: 'Low'},
			{name: 'Нормальный', value: 'Normal'},
			{name: 'Высокий', value: 'High'}
		];

		var initModel = function() {
			return {
				taskType: null,
				executors: [],
				dueDate: null,
				content: null,
				customStatus: null,
				priority: $scope.priorities[1]
			};
		};

		$scope.model = initModel();

		$scope.nextAction = 'goToTask';
		$scope.validation = { };

		var modelToRequest = function() {
			var m = $scope.model;
			var e = [];
			angular.forEach(m.executors, function(v, k) { this.push(v.id) }, e);
			return {
				TaskType: m.taskType.id,
				Executors: e,
				DueDate: m.dueDate,
				Content: m.content,
				CustomStatus: m.customStatus ? m.customStatus.id : null,
				Priority: m.priority.value
			};
		};

		var resetValidation = function() {
			$scope.validation.generalErrors = [];
			$scope.validation.fieldErrors = {};
		};
}]);