angular.module('tasks')
.directive('customPropertyEditor', ['sysConfig', function(sysConfig) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: sysConfig.src('tasks/task/customPropertyEditor.tpl.html'),
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