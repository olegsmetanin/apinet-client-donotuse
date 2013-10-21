angular.module('core')
.directive('inlineText', [function() {
	return {
		restrict: 'E',
		replace: true,
		template: function(elm, attr) {
			var inpt = '<input type="text" class="form-control' + 
				(attr.inputClass ? ' ' + attr.inputClass + '"' : '"') + 
				(attr.hasOwnProperty('required') ? ' required="required"' : '') +
				' ng-model="emodel.value" ng-readonly="waiting"></input>';
			var tmpl =
'<div inline-edit="' + attr.model + '">' +
'	<span class="editable" ng-hide="editMode" ng-click="edit()">{{ ' + attr.model + ' }}</span>' +
'	<form name="editForm" class="form-inline" ng-show="editMode" ng-class="{\'has-error\': editForm.$invalid}" style="width: 100%" novalidate>' +
'		<div class="input-group ' + (attr.inputCol ? attr.inputCol : '') + '" style="padding-left: 0px">' +
			inpt +
'			<inline-buttons class="input-group-btn"></inline-buttons>' +
'		</div>' +
'	</form>' +
'</div>'; return tmpl;
		}
	};
}]);