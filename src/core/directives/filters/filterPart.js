angular.module('core')
	.directive('filterPart', ['i18n', function(i18n) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			link: function($scope, element, attr) {
				attr.$set('box-title', null);
				attr.$set('box-col', null);
			},
			template: function(elm, attr) {
				return '<div class="box ' + attr.boxCol + '">' +
				'	<div class="box-header">' +
				'		<div class="title">' + i18n.msg(attr.boxTitle) + '</div>'+
				'		<div class="actions">' +
				'			<a class="btn box-collapse btn-xs btn-link" href="#"><i></i></a>' +
				'		</div>' +
				'	</div>' +
				'	<div class="box-content" ng-transclude></div>' +
				'</div>';
			}
		};
	}]);