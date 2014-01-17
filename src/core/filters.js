define(['./moduleDef', 'angular'], function (module, angular) {
	module.filter('yesNo', function() {
		return function(value){
			return !!value ? 'Да' : 'Нет';
		};
	})
	.filter('joinBy', function () {
		return function (input, delimiter) {
			return (input || []).join(delimiter || ',');
		};
	})
	.filter('textCut', function() {
		return function(input, max) {
			if (!input) {
				return input;
			}

			var result = angular.isString(input) ? input : input.toString();
			max = max || 35;
			if (result.length <= max){
				return result;
			}
			return result.substring(0, max - 1) + '…';
		};
	});
});
