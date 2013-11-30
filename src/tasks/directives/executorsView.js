define([
	'../moduleDef',
	'../../components/angular-infrastructure',
	'text!./executorsView.tpl.html',
	'css!./executorsView.css'
], function (module, angular, tpl) {
	module.directive('executors', function() {
		return {
			restrict: 'E',
			replace: true,
			template: tpl,
			scope: {
				executors: '=model'
			}
		};
	});
});