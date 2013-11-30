define(['../moduleDef'], function (module) {
	module.directive('agoBtnDelete', ['i18n', function() {
		return {
			restrict: 'E',
			replace: true,
			template: function() {
				return '<button type="button" class="btn btn-danger btn-sm">' +
					'<i class="icon-remove"></i>' +
					'</button>';
			}
		};
	}]);
});