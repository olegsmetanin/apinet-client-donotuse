angular.module('core')
.directive('scrollspy', ['$timeout', function($timeout) {
	return {
		restrict: 'A',
		link: function(scope, elm, attr) {
			//offset: 100 - reasonable default value, but mey be need settings from markup?
			$('body').scrollspy({target: attr.scrollspy, offset: 100});
			//timeout, because markup add dynamically after scrollspy calculate offsets
			//for anchors
			$timeout(function() {
				$('body').scrollspy('refresh');
			}, 50);
		}
	};
}]);