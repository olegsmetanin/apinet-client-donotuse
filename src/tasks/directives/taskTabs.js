define([
	'../moduleDef',
	'jquery',
	'text!./taskTabs.tpl.html',
	'bootstrap-tabdrop',
	'css!bootstrap-tabdrop/css'
], function (module, $, tpl) {
	module.directive('taskTabs', ['$rootScope', '$compile', function($rootScope, $compile) {
		return {
			restrict: 'E',
			replace: true,
			template: tpl,
			scope: {
				tab: '@currentTab',
				num: '=taskNum'
			},
			link: function(scope, elm) {
				scope.i18n = $rootScope.i18n;
				$target = $('.nav-responsive.nav-tabs', elm);
				$target.tabdrop();
				$compile($target.contents())(scope);
			}
		};
	}]);
});