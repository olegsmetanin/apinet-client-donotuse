angular.module('core')
	.directive('filterPersister', ['sysConfig', 'apinetService',
		function(sysConfig, apinetService) {
			return {
				replace: true,
				templateUrl: sysConfig.src('core/parts/filters/filterPersister.tpl.html'),
				scope: {
					group: '=',
					filter: '='
				},
				controller: ['$scope', function($scope) {
					angular.extend($scope, {
						validation: {
							generalError: null,
							fieldErrors: {}
						},
						saveFilterName: '',
						loadFilterName: { id:'', text: ''},

						filterNameLookupOptions: {
							query: function (query) {
								$scope.$apply(function() {
									apinetService.getModels({
										method: 'system/users/lookupFilters',
										group: $scope.group,
										term: query.term,
										page: query.page - 1,
										pageSize: 10
									})
									.then(function (result) {
										query.callback({
											results: result.rows || [ ],
											more: result.rows && result.rows.length === 10
										});
									}, function(error) {
										$scope.validation.generalError = error;
										query.callback({ results: [ ], more: false });
									});
								});
							}
						},

						saveFilter: function() {
							apinetService.action({
								method: 'system/users/saveFilter',
								name: $scope.saveFilterName,
								group: $scope.group,
								filter: $scope.filter
							})
							.then(function(result) {
								if(result.success) {
									$scope.saveFilterName = '';
								}
								else {
									angular.extend($scope.validation, result);
								}
							}, function(error) {
								$scope.validation.generalError = error;
							});
						},

						loadFilter: function() {
							apinetService.action({
								method: 'system/users/loadFilter',
								name: $scope.loadFilterName ? $scope.loadFilterName.id : null,
								group: $scope.group
							})
							.then(function(result) {
								$scope.loadFilterName = { id:'', text: ''};
								if(result) {
									for(var key in result) {
										if(!result.hasOwnProperty(key)) {
											continue;
										}
										$scope.filter[key] = result[key];
									}
								}
							}, function(error) {
								$scope.validation.generalError = error;
							});
						},

						deleteFilter: function() {
							apinetService.action({
								method: 'system/users/deleteFilter',
								name: $scope.loadFilterName ? $scope.loadFilterName.id : null,
								group: $scope.group
							})
							.then(function() {
								$scope.loadFilterName = { id:'', text: ''};
							}, function(error) {
								$scope.validation.generalError = error;
							});
						}
					});
				}]
			};
		}
	]);