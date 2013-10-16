angular.module('core')
.controller('breadCrumbsCtrl', ['$scope', 'pageConfig', function($scope, $pageConfig) {
	$scope.breadcrumbs = $pageConfig.current.breadcrumbs;
	$scope.$on('page:configChanged', function() {
		$scope.breadcrumbs = $pageConfig.current.breadcrumbs;
	});
}])
.directive('breadCrumbs', function() {
	return {
		restrict: 'A',
		replace: true,
		template: 
'<div class="btn-group" ng-controller="breadCrumbsCtrl">' +
'	<a class="breadcrumb-nav btn dropdown-toggle" data-toggle="dropdown">' +
'		<i class=\'icon-chevron-right\'></i>' +
'	</a>' +
'	<ul class="dropdown-menu">' +
'		<li ng-repeat="breadcrumb in breadcrumbs">' +
'			<a href="{{breadcrumb.url}}">{{breadcrumb.name}}</a>' +
'		</li>' +
'	</ul>' +
'</div>'
	};
})
.directive('breadCrumbsFull', function() {
	return {
		restrict: 'A',
		replace: true,
		template: 
'<ul class="breadcrumb breadcrumbfull-nav" ng-controller="breadCrumbsCtrl">' +
'	<li ng-repeat="breadcrumb in breadcrumbs" style="margin-right: 5px">' +
'		<a href="{{breadcrumb.url}}">{{breadcrumb.name}}</a>' +
'		<i class="icon-angle-right" ng-hide="$last"></i>' +
'	</li>' +
'</ul>'
	};
});