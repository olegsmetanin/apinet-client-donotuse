define(['../../moduleDef', 'text!./filteredListActions.tpl.html'], function (module, tpl) {
	module.directive('filteredListActions', [function() {
		return {
			restrict: 'A',
			replace: true,
			template: tpl
		};
	}]);
});