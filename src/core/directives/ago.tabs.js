define([
	'../moduleDef',
	'jquery',
	'text!./ago.tabs.tpl.html',
	'bootstrap-tabdrop',
	'css!bootstrap-tabdrop/css'
], function (module, $, tpl) {
	module.directive('agoTabs', ['$rootScope', '$compile', function($rootScope, $compile) {
		return {
			restrict: 'E',
			replace: true,
			template: tpl,
			scope: {
				tab: '@currentTab',
				items: '=tabItems'
			},
			link: function(scope, elm) {
				scope.i18n = $rootScope.i18n;
				$target = $('.nav-responsive.nav-tabs', elm);
				$target.tabdrop();
				$compile($target.contents())(scope);

				scope.$watch('items', function() {
					$target.tabdrop('layout');
				});
			}
		};
	}]);
});
