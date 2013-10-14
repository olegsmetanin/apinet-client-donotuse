angular.module('core')
.directive('inlineButtons', [function() {
	return {
		restrict: 'E',
		replace: true,
		template: 
'<div style="display: inline-block">' +
'	<button type="button" class="btn" ng-show="isChanged" ng-click="cancel()" ng-disabled="!cancelEnabled()" title="Отменить">' +
'		<i class="icon-reply"></i>' + 
'	</button>' +
'	<button type="button" class="btn" ng-show="isChanged" ng-click="update()" ng-disabled="!updateEnabled()" title="Сохранить">' +
'		<i class="icon-ok"></i>' +
'	</button>' +
'	<img ng-show="waiting" class="waiting"></img>' +
'</div>'
	};
}]);