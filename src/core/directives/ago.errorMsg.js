define([
	'../moduleDef',
	'angular',
	'text!./agoErrorMsg.tpl.html'
], function (module, angular, tpl) {
	module.directive('agoErrorMsg', function () {
		return {
			restrict: 'E',
			replace: true,
			template: tpl
		};
	});
});