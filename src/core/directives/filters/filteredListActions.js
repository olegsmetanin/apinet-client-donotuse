define(['angular', '../../moduleDef', 'text!./filteredListActions.tpl.html'], function (angular, module, tpl) {
	module.directive('filteredListActions', ['sysConfig', function(sysConfig) {
		return {
			restrict: 'A',
			replace: true,
			template: tpl
		};
	}]);
});