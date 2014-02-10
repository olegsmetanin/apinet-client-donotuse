define([
	'../../moduleDef',
	'angular',
	'text!./filtersBox.tpl.html'
], function (module, angular, tpl) {
	module.directive('filtersBox', [function() {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			template: tpl,
			scope: {
				meta: '@',
				group: '@',
				filter: '=filtersBox',
				sorters: '=',
				applyEnabled: '=',
				applyFilter: '=',
				resetFilter: '='
			},
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				angular.extend($scope, {
					i18n: $rootScope.i18n,
					collapsed: false,
					structuredCollapsed: true,
					favoritesCollapsed: true,
					sortersCollapsed: true,

					applyFilterClick: function(e) {
						if(e) {
							e.stopPropagation();
							e.preventDefault();
						}

						$scope.applyFilter();
					},

					resetFilterClick: function(e) {
						if(e) {
							e.stopPropagation();
							e.preventDefault();
						}

						$scope.resetFilter();
					}
				});

				this.$scope = $scope;

				$scope.$watch('applyEnabled', function(value) {
					if(value) {
						return;
					}
					$scope.collapsed = true;
				}, true);
			}]
		};
	}])
	.directive('filtersBoxMoreFilters', function() {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			template: '',
			require: '^filtersBox',
			compile: function(tElement, tAttr, transcludeFn) {
				return function($scope, element, attrs, filtersBoxCtrl) {
					filtersBoxCtrl.moreFiltersContent = transcludeFn(filtersBoxCtrl.$scope.$parent, function() {});
				};
			}
		};
	})
	.directive('filtersBoxMoreFiltersTransclude', function() {
		return {
			require: '^filtersBox',
			link: function($scope, element, attrs, filtersBoxCtrl) {
				$scope.$watch(function() { return filtersBoxCtrl.moreFiltersContent; }, function(value) {
					if (!value) {
						return;
					}
					element.html(angular.element(value));
				});
			}
		};
	});
});