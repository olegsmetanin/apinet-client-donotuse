angular.module('core')
.directive('inlineText', [function() {
	return {
		restrict: 'E',
		replace: true,
		template: function(elm, attr) {
			var tmpl =
'<div inline-edit="' + attr.model + '">' +
'	<span class="editable" ng-hide="editMode" ng-click="edit()">{{ ' + attr.model + ' }}</span>' +
'	<form name="editForm" class="input-append" ng-show="editMode" style="width: 100%" novalidate>' +
'		<input type="text" ' + 
	(attr.inputClass ? 'class="' + attr.inputClass + '"' : '') + 
	(attr.hasOwnProperty('required') ? ' required="required"' : '') +
	' ng-model="emodel.value" ng-readonly="waiting" />' +
'		<button type="button" class="btn" ng-show="isChanged" ng-click="cancel()" ng-disabled="!cancelEnabled()" title="Отменить">' +
'			<i class="icon-reply"></i>' + 
'		</button>' +
'		<button type="button" class="btn" ng-show="isChanged" ng-click="update()" ng-disabled="!updateEnabled()" title="Сохранить">' +
'			<i class="icon-ok"></i>' +
'		</button>' +
'		<img ng-show="waiting" class="waiting"></img>' +
'	</form>' +
'</div>'; return tmpl;
		}
	};
}]);