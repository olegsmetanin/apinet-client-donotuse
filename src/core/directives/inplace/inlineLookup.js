angular.module('core')
.directive('inlineLookup', ['$timeout', function($timeout) {
	return {
		restrict: 'E',
		replace: true,
		transclude: true,
		template: function(elm, attr) {
			var viewTmpl = attr.hasOwnProperty('multiple')
				? '<div style="display: inline-block" ng-transclude></div>'
				: '{{ ' + attr.model + '.text || \'---\' }}';

			var editTmpl = '<input type="text" ng-model="emodel.value" ng-readonly="waiting"' + 
				' lookup="' + attr.inputLookup + '" ' +
				(attr.inputClass ? ' class="' + attr.inputClass + '"' : '') + 
				(attr.hasOwnProperty('required') 
					? (attr.hasOwnProperty('multiple') ? ' required-multiple="true"' : ' ng-required="true"') 
					: '') +
				(attr.hasOwnProperty('multiple') ? ' multiple="multiple"' : '') +
				' lookup-options="{openOnEnter: false' + 
					(attr.inputLookupOptions ?  + ', ' + attr.inputLookupOptions : '') + '}" />';

			var tmpl =
'<div inline-edit="' + attr.model + '">' +
'	<span ng-hide="editMode" ng-click="edit()" class="editable">' + viewTmpl + '</span>' +
'	<form name="editForm" ng-show="editMode" style="width: 100%" novalidate>' +
editTmpl +
'		<button type="button" class="btn" ng-show="isChanged" ng-disabled="!cancelEnabled()" ng-click="cancel()" title="Отменить">' +
'			<i class="icon-reply"></i>' + 
'		</button>' +
'		<button type="button" class="btn" ng-show="isChanged" ng-click="update()" ng-disabled="!updateEnabled()" title="Сохранить">' +
'			<i class="icon-ok"></i>' +
'		</button>' +
'		<img ng-show="waiting" class="waiting"></img>' +
'	</form>' +
'</div>'; return tmpl;
		},
		link: function(scope, elm, attr) {
			//select2 not initialized if call without timeout
			$timeout(function() { 
				//inplaceEdit use this for focus() when enter in edit mode
				scope.elInput = attr.hasOwnProperty('multiple')
					? $('input.select2-input', elm)
					: $('.select2-focusser', elm);
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
