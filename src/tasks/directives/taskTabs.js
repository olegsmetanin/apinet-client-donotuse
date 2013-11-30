define([
	'../moduleDef',
	'../../components/angular-infrastructure',
	'text!./taskTabs.tpl.html'
], function (module, angular, tpl) {
	module.directive('tasTabs', ['$rootScope', function($rootScope) {
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
				$('.nav-responsive.nav-tabs', elm).tabdrop();
			}
		};
	}]);
});