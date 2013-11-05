define(['angular', '../moduleDef', 'text!./agoBox.tpl.html'], function (angular, module, tpl) {
	module.directive('agoErrorMsg', function () {
		return {
			restrict: 'E',
			replace: true,
			template: tpl
		};
	});
});