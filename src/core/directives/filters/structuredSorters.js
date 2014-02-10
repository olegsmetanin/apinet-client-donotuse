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
				sorters: '='
			},
			controller: ['$scope', '$rootScope', 'i18n', function($scope, $rootScope, i18n) {
				angular.extend($scope, {
					i18n: $rootScope.i18n,
					availableFields: [],
					sorters: $scope.sorters || [],

					dropped: function(dragEl) {
						$scope.moveElement(dragEl, $scope.availableFields, $scope.sorters);
					},

					reverted: function(dragEl) {
						$scope.moveElement(dragEl, $scope.sorters, $scope.availableFields);
					},
					
					moveElement: function(dragEl, from, to) {
						var result = null;

						var element = $(dragEl);
						var property = element.attr('property');
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
							$scope.$apply(function() {
								result = {
									property: src.property,
									displayName: src.displayName,
									direction: i18n.msg('core.sorting.ascending')
								};
								to.push(result);
								from.splice(index, 1);
							});
						}

						return result;
					},

					switchDirection: function(event) {
						var element = $(event.target);
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
					}
				});

				$metadataService.modelMetadata($scope.meta, null, function(metadata) {
					if(!metadata || !metadata.PrimitiveProperties) {
						return;
					}

					for(var key in metadata.PrimitiveProperties) {
						if(!metadata.PrimitiveProperties.hasOwnProperty(key)) {
							continue;
						}

						$scope.availableFields.push({
							property: key,
							displayName: metadata.PrimitiveProperties[key].DisplayName
						});

						for(var i = 0; i < $scope.sorters.length; i++) {
							if($scope.sorters[i].property === key) {
								$scope.sorters[i].displayName = metadata.PrimitiveProperties[key].DisplayName;
							}
						}
					}
				});
			}]
		};
	}
]);
});