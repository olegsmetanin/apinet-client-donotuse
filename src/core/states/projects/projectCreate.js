define([
	'../../moduleDef',
	'angular',
	'text!./projectCreate.tpl.html',
	'../projects'
], function (module, angular, tpl) {
	module.config(['$stateProvider', 'securityAuthorizationProvider', function($stateProvider, securityAuthorizationProvider) {
		$stateProvider.state({
			name: 'page.projects.projectCreate',
			url: '/projects/new',
			onEnter: function(pageConfig, i18n) {
				pageConfig.setConfig({
					breadcrumbs: [
						{ name: i18n.msg('projects.list.title'), url: 'page.projects.projectsList' },
						{ name: i18n.msg('projects.create.title'), url: 'page.projects.projectCreate' }
					]
				});
			},
			template: tpl,
			resolve: {
				adminUser: securityAuthorizationProvider.requireAdminUser()
			}
		});
	}])
	.controller('projectCreateCtrl', ['$scope', 'apinetService', '$state',
		function($scope, apinetService, $state) {
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

					var tagIds = $scope.model.Tags || [];
					for(var i = 0; i < tagIds.length; i++) {
						tagIds[i] = tagIds[i].id;
					}

					apinetService.action({
						method: 'core/projects/createProject',
						model: $scope.model,
						tagIds: tagIds
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