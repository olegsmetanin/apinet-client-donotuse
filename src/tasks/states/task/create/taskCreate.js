define(['angular', '../../../moduleDef', 'text!./taskCreate.tpl.html', 'text!../../moduleMenu.tpl.html'], function (angular, module, tpl, moduleMenuTpl) {
	module.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function ($stateProvider, sysConfig, securityAuthorizationProvider) {

		var taskCreate = {
				name: 'page.taskCreate',
				url: '/tasks/new',
				views: {
					'content': { template: tpl },
					'moduleMenu': { template: moduleMenuTpl }
				},
				resolve: {
					i18n: 'i18n',
					pageConfig: 'pageConfig',
					currentUser: securityAuthorizationProvider.requireAuthenticatedUser()
				},
				onEnter: function(pageConfig, i18n) {
					pageConfig.setConfig({
						breadcrumbs: [
							{ name: i18n.msg('tasks.list.title'), url: '#!/' },
							{ name: i18n.msg('tasks.create.title'), url: '#!/tasks/new' } ]
					});
				}
			};

			$stateProvider.state(taskCreate);
		}
	])
	.controller('taskCreateCtrl', ['$scope', 'sysConfig', 'apinetService', '$state',
		function($scope, sysConfig, apinetService, $state) {

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
					if (response.validation.success) {
						if ($scope.nextAction === 'goToTask') {
							$state.transitionTo('page.taskView', {num: response.model}, true);
						} else if ($scope.nextAction === 'goToList') {
							$state.transitionTo('page.root', {}, true);
						} else if ($scope.nextAction === 'stayHere') {
							$scope.model = initModel();
							$scope.form.$setPristine();
						}
					} else {
						resetValidation();
						angular.extend($scope.validation, response.validation);
					}
				}, function(error) {
					resetValidation();
					$scope.validation.generalErrors = [error];
				});
			};

			var initModel = function() {
				return {
					taskType: null,
					executors: [],
					dueDate: null,
					content: null,
					customStatus: null,
					priority: null
				};
			};

			$scope.model = initModel();

			$scope.nextAction = 'goToTask';
			$scope.validation = { };

			var modelToRequest = function() {
				var m = $scope.model;
				var e = [];
				angular.forEach(m.executors, function(v) { this.push(v.id); }, e);
				return {
					TaskType: m.taskType.id,
					Executors: e,
					DueDate: m.dueDate,
					Content: m.content,
					CustomStatus: m.customStatus ? m.customStatus.id : null,
					Priority: m.priority ? m.priority.id : null
				};
			};

			var resetValidation = function() {
				$scope.validation.generalErrors = [];
				$scope.validation.fieldErrors = {};
			};
	}]);
});