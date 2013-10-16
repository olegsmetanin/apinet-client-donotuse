angular.module('core')
.directive('eventNotifier', ['security', 'sysConfig', function(security, sysConfig) {
	return {
		templateUrl: sysConfig.src('core/parts/header/eventNotifier/eventNotifier.tpl.html'),
		restrict: 'EA',
		replace: true,
		scope: true,
		link: function($scope, $element, $attrs, $controller) { }
	};
}]);