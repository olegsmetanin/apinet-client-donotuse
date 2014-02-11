define(['../../moduleDef'], function (module) {
	module.directive('inlineCheckbox', [function() {
		return {
			restrict: 'E',
			replace: true,
			template: function(elm, attr) {
				var inpt = '<input type="checkbox"' +
					(attr.inputClass ? ' class="' + attr.inputClass + '"' : '') +
					(attr.hasOwnProperty('required') ? ' required="true"' : '') +
					' ng-model="emodel.value" ng-readonly="waiting"></input>';

				var whenDefined = '!!' + attr.model + ' ? ' + attr.trueExp + ' : ' + attr.falseExp;
				var viewValue = '!isEmpty() ? (' + whenDefined + ') : ""';
				
				var viewTmpl = '<span class="editable" ng-hide="editMode" ng-click="edit()">{{ ' +
					viewValue + ' }}<inline-none></inline-none></span>';

				return '<div inline-edit="' + attr.model + '">' +
					viewTmpl +
					'<form name="editForm" class="form-inline" ng-show="editMode" ng-class="{\'has-error\': editForm.$invalid}" novalidate>' +
					'	<div class="input-group ' + (attr.inputCol ? attr.inputCol : '') + '" style="padding-left: 0px">' +
						inpt +
					'		<inline-buttons class="input-group-btn"></inline-buttons>' +
					'	</div>' +
					'</form>' +
					'</div>';
			}
		};
	}]);
});