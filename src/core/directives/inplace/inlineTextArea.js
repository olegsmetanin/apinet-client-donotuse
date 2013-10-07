angular.module('core')
.directive('inlineTextArea', function() {
	return {
		restrict: 'E',
		replace: true,
		template: function(elm, attr) {
			var tmpl =
'<div inline-edit="' + attr.model + '">' +
'	<span ng-hide="editMode" ng-mouseenter="showEdit = true" ng-mouseleave="showEdit = false" class="editable">' +
'		<pre ng-click="edit()" ' + 
		(attr.preClass ? 'class="' + attr.preClass + '"' : '') + 
		' >{{ ' + attr.model + ' }}</pre>' +
'		<button type="button" class="btn btn-mini" ng-click="edit()" ng-show="showEdit" title="Редактировать">' +
'			<i class="icon-pencil"></i>' +
'		</button>' +
'	</span>' +
'	<form name="editForm" class="input-append span12" ng-show="editMode">' +
'		<textarea ' + 
	(attr.inputClass ? 'class="' + attr.inputClass + '"' : '') + 
	(attr.inputRows ? 'rows="' + attr.inputRows + '"' : '') + 
	(attr.hasOwnProperty('required') ? ' required="required"' : '') +
	' ng-model="emodel.value" />' +
'		<button type="button" class="btn" ng-show="editMode" ng-click="cancel()" title="Отменить">' +
'			<i class="icon-reply"></i>' + 
'		</button>' +
'		<button type="button" class="btn" ng-show="editMode" ng-click="update()" ng-disabled="editForm.$invalid" title="Сохранить">' +
'			<i class="icon-ok"></i>' +
'		</button>' +
'	</form>' +
'</div>'; return tmpl;
		}
 	};
});