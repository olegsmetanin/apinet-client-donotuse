angular.module('core')
	.directive("toptabbar", function() {
		return {
			templateUrl: sysConfig.src('core/parts/header/tabBar/topTabBar.tpl.html'),
			restrict: 'EA',
			replace: true,
			scope: {
				"active": "@"
			},
			link: function($scope, $element, $attrs, $controller) {

			}
		};
	});