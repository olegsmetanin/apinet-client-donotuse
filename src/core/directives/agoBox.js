define(['angular', '../moduleDef', 'text!./agoBox.tpl.html', 'css!./agoBox.css'], function (angular, module, tpl) {
	module.directive('agoBox', [function() {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			scope: {
				color: '@',
				border: '@',
				caption: '@',
				large: '@',
				padding: '@',
				collapsible: '@',
				collapsed: '=?',
				titleClickCollapse: '@'
			},
			template: tpl,
			controller: ['$scope', function($scope) {
				angular.extend($scope, {
					boxClass: {
						box: true,
						'ago-box': true
					},
					boxHeaderClass: {
						'box-header': true
					},
					boxContentClass: {
						'box-content': true
					},
					onHeaderClick: function() {
						if($scope.titleClickCollapseDefined) {
							$scope.collapsed = !$scope.collapsed;
						}
					}
				});

				angular.extend(this, {
					$scope: $scope,

					colorWatcher: function(value, oldValue) {
						if(oldValue) {
							delete $scope.boxHeaderClass[oldValue + '-background'];
						}

						if(value) {
							$scope.boxHeaderClass[value + '-background'] = true;
						}
					},
					borderWatcher: function(value, oldValue) {
						if(oldValue) {
							delete $scope.boxClass[oldValue + '-border'];
						}

						if(value) {
							$scope.boxClass[value + '-border'] = true;
						}

						$scope.boxClass['box-bordered'] = angular.isDefined(value);
					},
					largeWatcher: function(value) {
						$scope.boxHeaderClass['box-header-small'] = !angular.isDefined(value);
					},
					paddingWatcher: function(value) {
						$scope.boxContentClass['box-padding'] = angular.isDefined(value);
					},
					collapsibleWatcher: function(value) {
						$scope.collapsibleDefined = angular.isDefined(value);
					},
					titleClickCollapseWatcher: function(value) {
						$scope.titleClickCollapseDefined = angular.isDefined(value);
						$scope.boxHeaderClass['box-header-clickable'] = angular.isDefined(value);
					}
				});

				$scope.$watch('color', this.colorWatcher);
				$scope.$watch('border', this.borderWatcher);
				$scope.$watch('large', this.largeWatcher);
				$scope.$watch('padding', this.paddingWatcher);
				$scope.$watch('collapsible', this.collapsibleWatcher);
				$scope.$watch('titleClickCollapse', this.titleClickCollapseWatcher);

				//TODO realy needs this call?
				this.colorWatcher($scope.color);
				this.borderWatcher($scope.border);
				this.largeWatcher($scope.large);
				this.paddingWatcher($scope.padding);
				this.collapsibleWatcher($scope.collapsible);
				this.titleClickCollapseWatcher($scope.titleClickCollapse);
			}]
		};
	}])
	.directive('agoBoxTitle', function() {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			template: '',
			require: '^agoBox',
			compile: function(tElement, tAttr, transcludeFn) {
				return function($scope, element, attrs, agoBoxCtrl) {
					agoBoxCtrl.titleContent = transcludeFn(agoBoxCtrl.$scope.$parent, function() {});
				};
			}
		};
	})
	.directive('agoBoxTitleTransclude', function() {
		return {
			require: '^agoBox',
			link: function($scope, element, attrs, agoBoxCtrl) {
				$scope.$watch(function() { return agoBoxCtrl.titleContent; }, function(value) {
					if (!value) {
						return;
					}
					element.html(angular.element(value));
				});
			}
		};
	})
	.directive('agoBoxActions', function() {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			template: '',
			require: '^agoBox',
			compile: function(tElement, tAttr, transcludeFn) {
				return function($scope, element, attrs, agoBoxCtrl) {
					agoBoxCtrl.actionsContent = transcludeFn(agoBoxCtrl.$scope.$parent, function() {});
				};
			}
		};
	})
	.directive('agoBoxActionsTransclude', function() {
		return {
			require: '^agoBox',
			link: function($scope, element, attrs, agoBoxCtrl) {
				$scope.$watch(function() { return agoBoxCtrl.actionsContent; }, function(value) {
					if (!value) {
						return;
					}
					element.html(angular.element(value));
				});
			}
		};
	})
	.directive('agoBoxContent', function() {
		return {
			restrict: 'EA',
			replace: true,
			transclude: true,
			template: '',
			require: '^agoBox',
			compile: function(tElement, tAttr, transcludeFn) {
				return function($scope, element, attrs, agoBoxCtrl) {
					agoBoxCtrl.contentContent = transcludeFn(agoBoxCtrl.$scope.$parent, function() {});
				};
			}
		};
	})
	.directive('agoBoxContentTransclude', function() {
		return {
			require: '^agoBox',
			link: function($scope, element, attrs, agoBoxCtrl) {
				$scope.$watch(function() { return agoBoxCtrl.contentContent; }, function(value) {
					if (!value) {
						return;
					}
					element.html(angular.element(value));
				});
			}
		};
	});
});