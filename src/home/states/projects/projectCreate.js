define([
	'../../moduleDef',
	'../../../components/angular-infrastructure',
	'text!./projectCreate.tpl.html',
	'../projects'
], function (module, angular, tpl) {
	module.config(['$stateProvider', 'securityAuthorizationProvider', function($stateProvider, securityAuthorizationProvider) {
		$stateProvider.state('page.projects.projectCreate', {
			url: '/projects/new',
			onEnter: function(pageConfig, i18n) {
				pageConfig.setConfig({
					breadcrumbs: [
						{ name: i18n.msg('projects.list.title'), url: '/#!/projects/listview' },
						{ name: i18n.msg('projects.create.title'), url: '/#!/projects/new' }
					]
				});
			},
			template: tpl,
			resolve: {
				adminUser: securityAuthorizationProvider.requireAdminUser()
			}
		});
	}])
	.controller('projectCreateCtrl', ['$scope', 'sysConfig', 'apinetService', '$state',
		function($scope, sysConfig, apinetService, $state) {
			angular.extend($scope, {
				model: { },
				validation: { },

				cancel: function() {
					$state.transitionTo('page.projects.projectsList', {}, true);
				},

				handleException: function(error) {
					$scope.resetValidation();
					$scope.validation.generalErrors = [error];
				},

				handleValidationErrors: function(validation) {
					$scope.resetValidation();
					angular.extend($scope.validation, validation);
				},

				resetValidation: function() {
					$scope.validation = { };
				},

				create: function() {
					$scope.resetValidation();
					if($scope.model.Type) {
						$scope.model.Type = $scope.model.Type.id;
					}

					apinetService.action({
						method: 'home/projects/createProject',
						model: $scope.model
					}).then(function(result) {
						if(typeof result.success === 'undefined' || result.success) {
							$state.transitionTo('page.projects.projectsList');
						}
						else {
							$scope.handleValidationErrors(result);
						}
					}, $scope.handleException);
				}
			});
		}
	]);
});