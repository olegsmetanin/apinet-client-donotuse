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
.controller('taskViewCtrl', ['$scope', 'sysConfig', 'apinetService', '$window', '$timeout', '$stateParams',
	function($scope, sysConfig, apinetService, $window, $timeout, $stateParams) {

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
			console.log('Change status for %s', hrecord.Text);
		};

		$scope.changeCustomStatus = function(hrecord) {
			console.log('Change custom status for %s', hrecord.Text);
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

		$scope.addAgreemer = function() {
			apinetService.action({
				method: 'tasks/tasks/AddAgreemer',
				taskId: $scope.model.Id,
				participantId: $scope.editables.newAgreemer.id })
			.then(function(response) {
				$scope.model.Agreements.push(response);
			}, handleException);
		};

		$scope.removeAgreement = function(agreement) {
			if (!$window.confirm('Вы действительно хотите удалить согласующего?')) {
				return;
			}

			apinetService.action({
				method: 'tasks/tasks/RemoveAgreement',
				taskId: $scope.model.Id,
				agreementId: agreement.Id })
			.then(function(response) {
				if (response === 'true') {
					var index = $scope.model.Agreements.indexOf(agreement);
					if (index >= 0) {
						$scope.model.Agreements.splice(index, 1);	
					}
				} else {
					$scope.validation.generalErrors = ['No agreement found. Refresh page.'];
				}
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
		$scope.editables = { newAgreemer: null };
}]);