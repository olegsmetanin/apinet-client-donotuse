angular.module('core')
.directive('inlineButtons', [function() {
	return {
		restrict: 'E',
		replace: true,
		template: '<div>' + 
'	<button type="button" class="btn" ng-show="isChanged" ng-click="cancel()" ng-disabled="!cancelEnabled()" title="{{ i18n.core.buttons.cancel }}">' +
'		<i class="icon-reply"></i>' + 
'	</button>' +
'	<button type="button" class="btn" ng-show="isChanged" ng-click="update()" ng-disabled="!updateEnabled()" title="{{ i18n.core.buttons.save }}">' +
'		<i class="icon-ok"></i>' +
'	</button>' +
'	<img ng-show="waiting" class="waiting"></img>' +
'</div>'
	};
}]);