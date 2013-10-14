angular.module('tasks')
.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig', 'securityAuthorizationProvider',
	function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig, securityAuthorizationProvider) {

	var taskView = {
			name: 'page.taskView',
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
.controller('taskViewCtrl', ['$scope', 'sysConfig', 'apinetService', '$stateParams',
	function($scope, sysConfig, apinetService, $stateParams) {

		//TODO move to utils??
		var make = function(task, prop, value, valueProp) {
			valueProp = valueProp || 'id';
			var val = angular.isArray(value)
				? value.map(function(item) { return item[valueProp] })
				: angular.isObject(value) && !angular.isDate(value) 
					? value[valueProp] 
					: value;
			return {Id: task.Id, ModelVersion: task.ModelVersion, Prop: prop, Value: val};
		}

		$scope.changeStatus = function(hrecord) {
			$scope.onUpdateProp($scope.model, 'Status', hrecord.id);
		};

		$scope.changeCustomStatus = function(hrecord) {
			$scope.onUpdateProp($scope.model, 'CustomStatus', hrecord.id);
		};

		$scope.onUpdateProp = function(task, prop, val) {
			apinetService.action({
				method: 'tasks/tasks/UpdateTask',
				project: sysConfig.project,
				data: make(task, prop, val) })
			.then(function(response) {
				$scope.resetValidation();
				angular.extend($scope.validation, response.validation);
				angular.extend($scope.model, response.model);
			}, handleException);
		};

		$scope.resetValidation = function() {
			if (!$scope.validation) {
				$scope.validation = {};
			}
			$scope.validation.generalErrors = [];
			$scope.validation.fieldErrors = {};
		};

		var handleException = function(error) {
			$scope.resetValidation();
			$scope.validation.generalErrors = [error];
		};

		apinetService.action({
			method: 'tasks/tasks/GetTask',
			project: sysConfig.project,
			numpp: $stateParams.num })
		.then(function(response) {
			$scope.model = response;
		}, handleException);

		$scope.resetValidation();
}]);