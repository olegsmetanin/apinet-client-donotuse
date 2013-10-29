angular.module('core')
	.directive('filtersBox', ['sysConfig', function(sysConfig) {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			templateUrl: sysConfig.src('core/directives/filters/filtersBox.tpl.html'),
			scope: {
				meta: '@',
				group: '@',
				filter: '=filtersBox',
				applyEnabled: '=',
				applyFilter: '=',
				resetFilter: '='
			},
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				angular.extend($scope, {
					i18n: $rootScope.i18n,
					collapsed: true,
					structuredCollapsed: true,
					favoritesCollapsed: true,

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