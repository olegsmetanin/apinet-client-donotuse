define(['angular', '../moduleDef', 'text!./executorsView.tpl.html', 'css!./executorsView.css'], 
function (angular, module, tpl) {
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