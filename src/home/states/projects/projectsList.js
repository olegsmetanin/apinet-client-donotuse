define([
	'../../moduleDef',
	'../../../components/angular-infrastructure',
	'text!./projectsList.tpl.html',
	'../projects',
	'css!./projectsList.css'
], function (module, angular, tpl) {
		module.config(['$stateProvider', function($stateProvider) {
			$stateProvider.state('page.projects.projectsList', {
				url: '/projects/listview',
				onEnter: function(pageConfig, i18n) {
					pageConfig.setConfig({
						breadcrumbs: [{
							name: i18n.msg('projects.list.title'),
							url: '/#!/projects/listview'
						}]
					});
				},
				template: tpl
			});
		}])
		.controller('projectsListCtrl', ['$scope', '$window', 'apinetService', function($scope, $window, apinetService) {
			angular.extend($scope, {
				createItemForm: { },
				editModel: { },
				deleteModel: { },
				validation: { },

				handleException: function(error) {
					$scope.resetValidation();
					$scope.validation.generalErrors = [error];
				},

				handleValidationErrors: function(validation) {
					$scope.resetValidation();
					angular.extend($scope.validation, validation);
				},

				createItem: function() {
					$scope.resetValidation();
					delete $scope.editModel.id;

					if ($scope.editModel.Type && $scope.editModel.Type.id) {
						$scope.editModel.Type = $scope.editModel.Type.id;
					}

					apinetService.action({
						method: 'home/projects/createProject',
						model: $scope.editModel
					}).then(function(result) {
						if(typeof result.success === 'undefined' || result.success) {
							$scope.dropChanges();
							$scope.models.unshift(result);
						}
						else {
							$scope.handleValidationErrors(result);
						}
					}, $scope.handleException);
				},

				dropChanges: function() {
					$scope.resetValidation();
					$scope.editModel = { };
					$scope.createItemForm.$setPristine();
					$scope.createItemForm.$setValidity('integer', true);
				},

				createEnabled: function() {
					return $scope.createItemForm.$valid && $scope.createItemForm.$dirty &&
						(typeof $scope.validation.success === 'undefined' || $scope.validation.success);
				}
			});

			$scope.$on('resetFilter', function() {
				$scope.filter.simple = { Participation: 'All' };
				$scope.requestParams.mode = 'All';
			});

			$scope.$watch('filter.simple.Participation', function(value) {
				$scope.requestParams.mode = value || 'All';
			}, true);
		}]);
});