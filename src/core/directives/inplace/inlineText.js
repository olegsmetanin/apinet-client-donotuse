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
	' ng-model="emodel.value" ng-readonly="waiting"></input>' +
'		<inline-buttons></inline-buttons>' +
'	</form>' +
'</div>'; return tmpl;
		}
	};
}]);