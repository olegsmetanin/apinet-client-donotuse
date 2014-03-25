define([
	'../../moduleDef',
	'angular',
	'text!./filterPersister.tpl.html'
], function (module, angular, tpl) {
	module.directive('filterPersister', ['apinetService', '$stateParams', function(apinetService, $stateParams) {
		return {
			replace: true,
			template: tpl,
			scope: {
				group: '=',
				filter: '='
			},
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				angular.extend($scope, {
					i18n: $rootScope.i18n,

					validation: {
						generalErrors: [],
						fieldErrors: {}
					},
					saveFilterName: '',
					loadFilterName: { },

					saveFilter: function() {
						apinetService.action({
							method: 'core/users/saveFilter',
							project: $stateParams.project,
							name: $scope.saveFilterName,
							group: $scope.group,
							filter: $scope.filter
						})
						.then(function(result) {
							if(!result.success) {
								angular.extend($scope.validation, result);
							}
						}, function(error) {
							$scope.validation.generalErrors = error;
						});
					},

					loadFilter: function() {
						apinetService.action({
							method: 'core/users/loadFilter',
							project: $stateParams.project,
							name: $scope.loadFilterName.lookupEntry ? $scope.loadFilterName.lookupEntry.id : null,
							group: $scope.group
						})
						.then(function(result) {
							if(result) {
								for(var key in result) {
									if(!result.hasOwnProperty(key)) {
										continue;
									}
									$scope.filter[key] = result[key];
								}
							}
						}, function(error) {
							$scope.validation.generalErrors = error;
						});
					},

					deleteFilter: function() {
						apinetService.action({
							method: 'core/users/deleteFilter',
							project: $stateParams.project,
							name: $scope.loadFilterName.lookupEntry ? $scope.loadFilterName.lookupEntry.id : null,
							group: $scope.group
						})
						.then(function() { }, function(error) {
							$scope.validation.generalErrors = error;
						});
					}
				});
			}]
		};
	}]);
});
