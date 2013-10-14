angular.module('core')
.directive('inlineTextArea', [function() {
	return {
		restrict: 'E',
		replace: true,
		template: function(elm, attr) {
			var tmpl =
'<div inline-edit="' + attr.model + '">' +
'	<pre ng-hide="editMode" ng-click="edit()" class="editable' + 
	(attr.preClass ? ' ' + attr.preClass + '"' : '"') + 
	'>{{ ' + attr.model + ' }}</pre>' +
'	<form name="editForm" class="input-append" ng-show="editMode" style="width: 100%" novalidate>' +
'		<textarea ' + 
	(attr.inputClass ? 'class="' + attr.inputClass + '"' : '') + 
	(attr.inputRows ? 'rows="' + attr.inputRows + '"' : '') + 
	(attr.hasOwnProperty('required') ? ' required="required"' : '') +
	' ng-model="emodel.value" ng-readonly="waiting"/>' +
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