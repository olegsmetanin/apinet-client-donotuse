define([
	'../../moduleDef',
	'text!./breadCrumbs.tpl.html',
	'text!./breadCrumbsFull.tpl.html'
], function (module, tpl, fullTpl) {
	module.directive('breadCrumbs', function() {
		return {
			restrict: 'A',
			replace: true,
			template: tpl
		};
	})
	.directive('breadCrumbsFull', function() {
		return {
			restrict: 'A',
			replace: true,
			template: fullTpl
		};
	});
});