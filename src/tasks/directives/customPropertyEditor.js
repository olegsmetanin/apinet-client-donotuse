define([
	'../moduleDef',
	'../../components/angular-infrastructure',
	'text!./customPropertyEditor.tpl.html'
], function (module, angular, tpl) {
	module.directive('customPropertyEditor', [function() {
		return {
			restrict: 'E',
			replace: true,
			template: tpl,
			link: function(scope, elm) {
				var $datepicker = $('input[ago-datepicker]', elm);

				var onShow = function() {
					scope.elInput.off('blur', scope.onBlur);
				};

				var onHide = function() {
					scope.elInput.on('blur', scope.onBlur);
				};

				$datepicker.on('show', onShow);
				$datepicker.on('hide', onHide);
			}
		};
	}]);
});