angular.module('core')
	.directive('twocolumnSide', function() {
		return {
			restrict: 'EA',
			transclude: true,
			replace: true,
			// templateUrl is not working! https://github.com/angular-ui/bootstrap/issues/790
			//templateUrl: sysConfig.src('core/parts/masterpages/twocolumnSide.tpl.html')
			template: '<div class="span3"><div ng-transclude></div></div>'
		};
	})
	.directive('twocolumnContent', function() {
		return {
			restrict: 'EA',
			transclude: true,
			replace: true,
			// templateUrl: sysConfig.src('core/parts/masterpages/twocolumnContent.tpl.html')
			template: '<div class="span9"><div ng-transclude></div></div>'
		};
	})
	.directive('container', function() {
		return {
			restrict: 'EA',
			transclude: true,
			replace: true,
			// templateUrl: sysConfig.src('core/parts/masterpages/container.tpl.html')
			template: '<div class="container-fluid"><div class="row-fluid"><div ng-transclude></div></div></div>'

		};
	});