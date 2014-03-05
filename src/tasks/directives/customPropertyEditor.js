define([
	'../moduleDef',
	'angular',
	'text!./customPropertyEditor.tpl.html'
], function (module, angular, tpl) {
	module.directive('customPropertyEditor', ['$timeout', function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			template: tpl,
			link: function(scope, elm) {
				var $datepicker = $('input[bs-datepicker]', elm);
				$datepicker.off(scope.onBlur);
				$datepicker.on('blur', function() {
					$timeout(scope.onBlur);
				})
			}
		};
	}]);
});