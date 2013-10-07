angular.module('core')
.directive('inlineDate', ['$timeout', function($timeout) {
	return {
		restrict: 'E',
		replace: true,
		template: function(elm, attr) {
			var tmpl =
'<div inline-edit="' + attr.model + '">' +
'	<span ng-hide="editMode" ng-mouseenter="showEdit = true" ng-mouseleave="showEdit = false" class="editable">' +
'		<span ng-click="edit()">{{ (' +
			attr.model + 
			(attr.dateFormat ? '|date:\'' + attr.dateFormat + '\'' : '') +
			') || \'---\' }}</span>' +
'		<button type="button" class="btn btn-mini" ng-click="edit()" ng-show="showEdit" title="Редактировать">' +
'			<i class="icon-pencil"></i>' +
'		</button>' +
'	</span>' +
'	<form name="editForm" class="input-append span12" ng-show="editMode">' +
'		<input type="text" ' + 
	(attr.inputClass ? 'class="' + attr.inputClass + '"' : '') + 
	(attr.hasOwnProperty('required') ? ' required="required"' : '') +
	' ng-model="emodel.value" ui-date="{dateFormat:\'dd.mm.yy\', changeMonth: true, changeYear: true}" ui-date-format="" />' +
'		<button type="button" class="btn" ng-show="isChanged" ng-click="cancel()" title="Отменить">' +
'			<i class="icon-reply"></i>' + 
'		</button>' +
'		<button type="button" class="btn" ng-show="isChanged" ng-click="update()" ng-disabled="editForm.$invalid" title="Сохранить">' +
'			<i class="icon-ok"></i>' +
'		</button>' +
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
