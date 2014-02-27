define([
	'../../moduleDef',
	'jquery',
	'angular',
	'text!./structuredSorters.tpl.html'
], function (module, $, angular, tpl) {
	module.directive('structuredSorters', ['$compile', 'metadataService', function($compile, $metadataService) {
		return {
			replace: true,
			template: tpl,
			scope: {
				meta: '=',
				sorters: '=',
				expanded: '='
			},
			controller: ['$scope', '$rootScope', 'i18n', function($scope, $rootScope, i18n) {
				angular.extend($scope, {
					i18n: $rootScope.i18n,
					availableFields: null,
					sorters: $scope.sorters || [],

					dropped: function(dragEl) {
						var element = $(dragEl);
						var property = element.attr('property');
						$scope.moveElement(property, $scope.availableFields, $scope.sorters);
					},

					reverted: function(dragEl) {
						var element = $(dragEl);
						var property = element.attr('property');
						$scope.moveElement(property, $scope.sorters, $scope.availableFields);
					},

					add: function(property) {
						$scope.moveElement(property, $scope.availableFields, $scope.sorters);
					},

					remove: function(property) {
						$scope.moveElement(property, $scope.sorters, $scope.availableFields);
					},
					
					moveElement: function(property, from, to) {
						var result = null;

						if(!property) {
							return result;
						}

						var index = -1;
						for(var i = 0; i < from.length; i++) {
							if(from[i].property === property) {
								index = i;
								break;
							}
						}

						if(index >= 0) {
							var src = from[index];
							var fn = function() {
								result = {
									property: src.property,
									displayName: src.displayName,
									direction: i18n.msg('core.sorting.ascending')
								};
								to.push(result);
								from.splice(index, 1);
							};

							if($rootScope.$$phase) {
								fn();
							}
							else {
								$scope.$apply(fn);
							}
						}

						return result;
					},

					switchDirection: function(event) {
						var element = $(event.currentTarget);
						var property = element.attr('property');

						var sorter = null;
						for(var i = 0; i < $scope.sorters.length; i++) {
							if($scope.sorters[i].property === property) {
								sorter = $scope.sorters[i];
								break;
							}
						}

						if(sorter) {
							if(!sorter.descending) {
								sorter.descending = true;
							}
							else {
								delete sorter.descending;
							}
							sorter.direction = !sorter.descending ? i18n.msg('core.sorting.ascending') : i18n.msg('core.sorting.descending');
						}
					},

					processMetadata: function() {
						if($scope.availableFields) {
							return;
						}

						$metadataService.modelMetadata($scope.meta, null, function(metadata) {
							if(!metadata || !metadata.PrimitiveProperties) {
								return;
							}

							$scope.availableFields = [];
							for(var key in metadata.PrimitiveProperties) {
								if(!metadata.PrimitiveProperties.hasOwnProperty(key)) {
									continue;
								}

								$scope.availableFields.push({
									property: key,
									displayName: metadata.PrimitiveProperties[key].DisplayName
								});

								for(var i = 0; i < $scope.sorters.length; i++) {
									for(var j = 0; j < $scope.availableFields.length; j++) {
										if($scope.availableFields[j].property === $scope.sorters[i].property) {
											$scope.availableFields.splice(j, 1);
											break;
										}
									}

									if($scope.sorters[i].property === key) {
										$scope.sorters[i].displayName = metadata.PrimitiveProperties[key].DisplayName;
									}
								}
							}
						});
					}
				});

				$scope.$watch('expanded', function(value) {
					if(value) {
						$scope.processMetadata();
					}
				}, true);
			}]
		};
	}
]);
});