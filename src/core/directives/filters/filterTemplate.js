angular.module('core')
	.directive('filterTemplate', ['i18n', function(i18n) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			template: function() {
				return '<div class="box box-collapsed">' +
					'	<div class="box-header purple-background">' +
					'		<div class="title">' + i18n.msg('core.filters.title') + '</div>' +
					'		<div class="actions">' +
					'			<a class="btn box-collapse btn-xs btn-link" href="#"><i></i></a>' +
					'		</div>' +
					'	</div>' +
					'	<div class="box-content">' +
					'		<div class="box-toolbox box-toolbox-top">' +
					'			<div filtered-list-actions></div>' +
					'		</div>' +
					'		<div class="row" ng-transclude></div>' +
					'	</div>' +
					'</div>';
			}
		};
	}]);