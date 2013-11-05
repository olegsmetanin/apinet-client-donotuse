define(['angular', '../moduleDef'], function (angular, module) {
	module.directive('agoBtnDelete', ['i18n', function(i18n) {
		return {
			restrict: 'E',
			replace: true,
			template: function(elm, attr) {
				return '<button type="button" class="btn btn-danger btn-sm">' +
					'<i class="icon-remove"></i>' +
					'</button>';
			}
		};
	}]);
});