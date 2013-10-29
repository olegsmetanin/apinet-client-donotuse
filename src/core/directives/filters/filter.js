angular.module('core')
	.directive('filter', ['i18n', function() {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			link: function($scope, element, attr) {
				attr.$set('meta', null);
				attr.$set('group', null);
			},
			template: function(elm, attr) {
				//div wrap needed, because error "Multiple directives [directive#1, directive#2] asking for isolated scope on"
				return '<div><' + (attr.wrapperDirective || 'filter-template') +'>' +
				'	<filter-part box-title="core.filters.simple" box-col="col-lg-4">' +
				'		<div ng-transclude></div>' +
				'	</filter-part>' +
				'	<filter-part box-title="core.filters.complex" box-col="col-lg-4">' +
				'		<div structured-filter filter-ng-model="filter.complex" meta="\'' + attr.meta + '\'"></div>' +
				'	</filter-part>' +
				'	<filter-part box-title="core.filters.favorites" box-col="col-lg-4">' +
				'		<div filter-persister group="\'' + attr.group + '\'" filter="filter"></div>' +
				'	</filter-part>' +
				'</' + (attr.wrapperDirective || 'filter-template') +'></div>';
			}
		};
	}]);