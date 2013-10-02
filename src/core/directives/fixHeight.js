angular.module('core')
.directive('fixHeight', function() {
	return {
		restrict: 'A',
		link: function(scope, elm, attr) {
	        var adjastSideBarHeight = function() {
				var $vm = $(elm);
				if ($vm.length <= 0) return;

				//100 is temporaty fix, see http://code.agosystems.com/issues/1327
				var sideBarHeight = $(window).height() - $vm.position().top - 100;
				$vm.css('max-height', sideBarHeight + 'px');

				var sideMenu = $vm.children(0);
				if (sideMenu && sideMenu.children().length > 0) {
					//только если задан контент для аффикса, иначе смысла нету двигать его
					$vm.css('height', sideBarHeight + 'px');
				}

				//console.log(sideBarHeight + 'px');
			};

			$(window).on('resize', adjastSideBarHeight);

			adjastSideBarHeight();
		}
	};
});