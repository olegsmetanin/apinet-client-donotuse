define(['angular', '../../moduleDef', 'text!./eventNotifier.tpl.html'], function (angular, module, tpl) {
	module.directive('eventNotifier', ['security', 'sysConfig', function(security, sysConfig) {
		return {
			template: tpl,
			restrict: 'EA',
			replace: true,
			scope: true,
			link: function($scope, $element, $attrs, $controller) { }
		};
	}]);
});