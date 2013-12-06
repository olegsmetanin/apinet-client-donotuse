define([
	'../../moduleDef',
	'angular',
	'text!./filterPersister.tpl.html'
], function (module, angular, tpl) {
	module.directive('filterPersister', ['apinetService', function(apinetService) {
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

					filterNames: [ ],
					validation: {
						generalErrors: [],
						fieldErrors: {}
					},
					saveFilterName: '',
					loadFilterName: { id:'', text: ''},

					saveFilter: function() {
						apinetService.action({
							method: 'core/users/saveFilter',
							name: $scope.saveFilterName,
							group: $scope.group,
							filter: $scope.filter
						})
						.then(function(result) {
							if(result.success) {
								if($scope.filterNames.indexOf($scope.saveFilterName) === -1) {
									$scope.filterNames.push($scope.saveFilterName);
								}
							}
							else {
								angular.extend($scope.validation, result);
							}
						}, function(error) {
							$scope.validation.generalErrors = error;
						});
					},

					loadFilter: function() {
						apinetService.action({
							method: 'core/users/loadFilter',
							name: $scope.loadFilterName ? $scope.loadFilterName : null,
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
							name: $scope.loadFilterName ? $scope.loadFilterName : null,
							group: $scope.group
						})
						.then(function() {
							var index = $scope.filterNames.indexOf($scope.loadFilterName);
							if(index === -1) {
								return;
							}
							$scope.filterNames.splice(index, 1);
						}, function(error) {
							$scope.validation.generalErrors = error;
						});
					}
				});

				apinetService.getModels({
					method: 'core/users/getFilterNames',
					group: $scope.group
				})
				.then(function (result) {
					$scope.filterNames = result;
				});
			}]
		};
	}]);
});