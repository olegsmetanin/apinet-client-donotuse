angular.module('core')
	.directive('accordionClosed', [ function() {
		return {
			restrict: 'A',
			priority: -1000,
			require: 'accordion',
			scope: {
				allClosed: '=accordionClosed'
			},
			link: function($scope, element, attrs, accordionCtrl) {
				$scope.$watch('allClosed', function(value) {
					if(!value) {
						return;
					}

					angular.forEach(accordionCtrl.groups, function (group) {
						group.isOpen = false;
					});
				}, true);
			}
		};
	}]);