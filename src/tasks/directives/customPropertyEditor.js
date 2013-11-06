define(['angular', '../moduleDef', 'text!./customPropertyEditor.tpl.html'], function (angular, module, tpl) {
	module.directive('customPropertyEditor', ['sysConfig', function(sysConfig) {
		return {
			restrict: 'E',
			replace: true,
			template: tpl,
			link: function(scope, elm) {
				var $datepicker = $('input[ago-datepicker]', elm);

				var onShow = function(e) {
					scope.elInput.off('blur', scope.onBlur);
				};

				var onHide = function(e) {
					scope.elInput.on('blur', scope.onBlur);
				};

				$datepicker.on('show', onShow);
				$datepicker.on('hide', onHide);
			}
		};
	}]);
});