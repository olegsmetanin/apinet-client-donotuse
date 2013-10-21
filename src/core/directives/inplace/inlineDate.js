angular.module('core')
.directive('inlineDate', ['$timeout', function($timeout) {
	return {
		restrict: 'E',
		replace: true,
		template: function(elm, attr) {
			var tmpl =
'<div inline-edit="' + attr.model + '">' +
'	<span ng-hide="editMode" ng-click="edit()" class="editable">{{ (' +
		attr.model + 
		(attr.dateFormat ? '|date:\'' + attr.dateFormat + '\'' : '') +
		') || \'---\' }}</span>' +
'	<form name="editForm" class="form-inline" ng-show="editMode" style="width: 100%" novalidate>' +
'		<div class="input-group ' + (attr.inputCol ? attr.inputCol : '') + '" style="padding-left: 0px">' +
'			<input type="text"' + 
	' class="form-control ' + (attr.inputClass ? attr.inputClass + '"' : '"') + 
	(attr.hasOwnProperty('required') ? ' required="required"' : '') +
	' ng-model="emodel.value" ui-date="{dateFormat:\'dd.mm.yy\', changeMonth: true, changeYear: true}" ui-date-format="" ng-readonly="waiting"></input>' +
'			<inline-buttons class="input-group-btn"></inline-buttons>' +
'		</div>' +
'	</form>' +
'</div>'; return tmpl;
		},
		link: function(scope, elm, attr) {

			var onShow = function(input) {
				$(input).off('blur', scope.onBlur);
			};

			var onClose = function(dateVal, input) {
				$(input.input).focus();
				$(input.input).on('blur', scope.onBlur);
			};

			$timeout(function() { 
				//jquery ui datepicker not initialized if call without timeout
				$('input', elm).datepicker('option', 'beforeShow', onShow);
				$('input', elm).datepicker('option', 'onClose', onClose);
			}, 50);
		}
	};
}]);