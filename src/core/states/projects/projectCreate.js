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
			template: tpl,
			onEnter: function($rootScope) {
				$rootScope.breadcrumbs.push({
					name: 'projects.create.title',
					url: 'page.projects.projectCreate'
				});
			},
			onExit: function($rootScope) {
				$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
			}
		});
	}])
	.controller('projectCreateCtrl', ['$scope', 'apinetService', '$state', '$location',
		function($scope, apinetService, $state, $location) {
			angular.extend($scope, {
				model: { },
				validation: { },

				cancel: function() {
					$state.go('page.projects.projectsList');
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
					var model = angular.copy($scope.model);//operate on copy, because else select2 will fail when Type changed
					if(model.Type) {
						model.Type = model.Type.id;
					}

					var tagIds = model.Tags || [];
					for(var i = 0; i < tagIds.length; i++) {
						tagIds[i] = tagIds[i].id;
					}

					var createTimeout = 1000 * 15; //increase default timeout because need time to create db
					apinetService.action({
						method: 'core/projects/createProject',
						model: model,
						serverId: model.Server.id,
						tagIds: tagIds
					}, createTimeout).then(function(result) {
						if(typeof result.success === 'undefined' || result.success) {
							$location.url('/project/' + $scope.model.ProjectCode +'/settings');
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