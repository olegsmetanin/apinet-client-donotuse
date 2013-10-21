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
'	<form name="editForm" class="form-inline" ng-show="editMode" style="width: 100%" novalidate>' +
'		<div class="input-group ' + (attr.inputCol ? attr.inputCol : '') + '" style="padding-left: 0px">' +
'			<textarea' + 
		' class="form-control ' + (attr.inputClass ? ' ' + attr.inputClass + '"' : '"') + 
		(attr.inputRows ? ' rows="' + attr.inputRows + '"' : '') + 
		(attr.hasOwnProperty('required') ? ' required="true"' : '') +
		' ng-model="emodel.value" ng-readonly="waiting"></textarea>' +
'			<inline-buttons class="input-group-btn" style="vertical-align: top"></inline-buttons>' +
'		</div>'+
'	</form>' +
'</div>'; return tmpl;
		}
 	};
}]);