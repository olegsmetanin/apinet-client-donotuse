angular.module('core')
.directive('inlineLookup', ['$timeout', function($timeout) {
	return {
		restrict: 'E',
		replace: true,
		template: function(elm, attr) {
			var tmpl =
'<div inline-edit="' + attr.model + '">' +
'	<span ng-hide="editMode" ng-mouseenter="showEdit = true" ng-mouseleave="showEdit = false" class="editable">' +
'		<span ng-click="edit()">{{ ' + attr.model + '.text || \'---\' }}</span>' +
'		<button type="button" class="btn btn-mini" ng-click="edit()" ng-show="showEdit" title="Редактировать">' +
'			<i class="icon-pencil"></i>' +
'		</button>' +
'	</span>' +
'	<form name="editForm" class="span12" ng-show="editMode" novalidate>' +
'		<input type="text" ' + 
	(attr.inputClass ? 'class="' + attr.inputClass + '"' : '') + 
	(attr.hasOwnProperty('required') ? 
		(attr.hasOwnProperty('multiple') ? 'required-multiple' : ' required="required"') 
		: '') +
	' ng-model="emodel.value" lookup="' + attr.inputLookup + '" ' +
	' lookup-options="{openOnEnter: false' + 
	(attr.inputLookupOptions ?  + ', ' + attr.inputLookupOptions : '') + '}" />' +
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
			//select2 not initialized if call without timeout
			$timeout(function() { 
				//inplaceEdit use this for focus() when enter in edit mode
				scope.elInput = $('.select2-focusser', elm);
				//select2 has self specific blur
				$('input', elm).off('blur', scope.onBlur);

				$('input', elm).on('select2-blur', scope.onBlur);
				$('input', elm).on('select2-opening', function(e) { 
					$('input', elm).off('select2-blur', scope.onBlur);
				});
				$('input', elm).on('select2-close', function(e) {
					//if attach without timeout, blur handled right after close
					$timeout(function() {
						$('input', elm).on('select2-blur', scope.onBlur);	
					});
				});
				//enter and esc handling does not work, because of killEvent in select2 code
			}, 50);
		}
	};
}]);
