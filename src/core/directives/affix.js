angular.module('core')
.directive('affix', function() {
		return {
			restrict: 'A',
			link: function(scope, elm, attr) {
				var options = {};
				if (attr.offsetTop) {
					options.top = parseInt(attr.offsetTop, 10);
				}
				if (attr.offsetBottom) {
					options.bottom = parseInt(attr.offsetBottom, 10)
				}
				$(elm).affix(options);
			}
		}
	})