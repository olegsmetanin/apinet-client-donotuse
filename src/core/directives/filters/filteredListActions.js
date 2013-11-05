define(['angular', '../../moduleDef', 'text!./filteredListActions.tpl.html'], function (angular, module, tpl) {
	module.directive('filteredListActions', [function() {
		return {
			restrict: 'A',
			replace: true,
			template: tpl
		};
	}]);
});