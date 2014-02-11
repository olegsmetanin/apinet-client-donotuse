define([
	'../moduleDef',
	'angular',
	'text!./taskProjectInfo.tpl.html',
	'text!./moduleMenu.tpl.html'
], function (module, angular, tpl, moduleMenuTpl) {
	module.state({
		name: 'page.project.settings',
		url: '/settings',
		views: {
			'': { template: tpl },
			'moduleMenu@page': { template: moduleMenuTpl }
		},
		onEnter: function(pageConfig, i18n, $rootScope) {
			var unwatch = $rootScope.$watch('currentProjectName', function(value) {
				if(!value) {
					return;
				}
				unwatch();

				pageConfig.setConfig({
					breadcrumbs: [
						{ name: i18n.msg('projects.list.title'), url: 'page.projects.projectsList' },
						{ name: value, url: 'page.project.tasks' },
						{ name: i18n.msg('projects.settings.title'), url: 'page.project.settings' }
					]
				});
			});
		}
	}).controller('projectInfoCtrl', ['$scope', '$stateParams', 'apinetService', 'i18n', 
		function($scope, $stateParams, apinetService, i18n) {
			$scope.resetValidation = function() {
				if (!$scope.validation) {
					$scope.validation = {};
				}
				$scope.validation.generalErrors = [];
				$scope.validation.fieldErrors = {};
			};

			handleException = function(error) {
				$scope.resetValidation();
				$scope.validation.generalErrors = [error];
			};

			$scope.load = function() {
				apinetService.action({
					method: 'tasks/project/getProject',
					project: $stateParams.project
				}).then(function(response) {
					$scope.model = response;
				}, handleException);
			};

			var make = function(project, prop, value, valueProp) {
				valueProp = valueProp || 'id';
				var val = angular.isArray(value) ? value.map(function(item) { return item[valueProp]; })
					: angular.isObject(value) && !angular.isDate(value)	? value[valueProp] : value;
				return {Id: project.Id, ModelVersion: project.ModelVersion, Prop: prop, Value: val};
			};

			$scope.onUpdateProp = function(project, prop, val) {
				return apinetService.action({
					method: 'tasks/project/updateProject',
					project: $stateParams.project,
					data: make(project, prop, val) })
				.then(function(response) {
					$scope.resetValidation();
					angular.extend($scope.validation, response.validation);
					angular.extend($scope.model, response.model);
					return response.validation.success;
				}, handleException);
			};

			$scope.onError = function(error) {
				handleException(error);
			};

			//use empty object, because tags->lookup->ago.select2+select2 directive creata copy on
			//start (ago.select2) if model is undefined or null
			$scope.model = { };
			$scope.resetValidation();
			$scope.load();
		}
	]);
});