define([
	'../../../moduleDef',
	'angular',
	'text!./taskView.tpl.html',
	'text!../../moduleMenu.tpl.html'
], function (module, angular, tpl, moduleMenuTpl) {
	module.state({
		name: 'page.project.taskView',
		url: '/tasks/:num',
		views: {
			'': { template: tpl },
			'moduleMenu@page': { template: moduleMenuTpl }
		},
		onEnter: ['pageConfig', '$stateParams', 'i18n', function(pageConfig, $stateParams, i18n) {
			pageConfig.setConfig({
				breadcrumbs: [
					{ name: i18n.msg('tasks.list.title'), url: 'page.project.tasks' },
					{ name: $stateParams.num, url: 'page.project.taskView' }]
			});
		}]
	}).controller('taskViewCtrl', ['$scope', '$stateParams', 'apinetService',
		function($scope, $stateParams, apinetService) {

			//TODO move to utils??
			var make = function(task, prop, value, valueProp) {
				valueProp = valueProp || 'id';
				var val = angular.isArray(value) ? value.map(function(item) { return item[valueProp]; })
					: angular.isObject(value) && !angular.isDate(value)	? value[valueProp] : value;
				return {Id: task.Id, ModelVersion: task.ModelVersion, Prop: prop, Value: val};
			};

			$scope.changeStatus = function(hrecord) {
				$scope.onUpdateProp($scope.model, 'Status', hrecord.id);
			};

			$scope.changeCustomStatus = function(hrecord) {
				$scope.onUpdateProp($scope.model, 'CustomStatus', hrecord.id);
			};

			$scope.onUpdateProp = function(task, prop, val) {
				return apinetService.action({
					method: 'tasks/tasks/UpdateTask',
					project: $stateParams.project,
					data: make(task, prop, val) })
				.then(function(response) {
					$scope.resetValidation();
					angular.extend($scope.validation, response.validation);
					angular.extend($scope.model, response.model);
					return response.validation.success;
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
				project: $stateParams.project,
				numpp: $stateParams.num })
			.then(function(response) {
				$scope.model = response;
			}, handleException);

			$scope.resetValidation();
		}
	]);
});