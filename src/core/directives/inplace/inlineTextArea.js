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
	' ng-model="emodel.value" ng-readonly="waiting"></textarea>' +
'		<inline-buttons></inline-buttons>' +
'	</form>' +
'</div>'; return tmpl;
		}
 	};
}]);