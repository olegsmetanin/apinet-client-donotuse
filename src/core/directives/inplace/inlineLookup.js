define(['angular', '../../moduleDef'], function (angular, module) {
	module.directive('inlineLookup', ['$timeout', function($timeout) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			template: function(elm, attr) {
				var viewTmpl = attr.hasOwnProperty('multiple')
					? '<div style="display: inline-block" ng-transclude></div>'
					: '{{ ' + attr.model + '.text }}';

				var editTmpl = '<input type="text" ng-model="emodel.value" ng-readonly="waiting"' +
					' lookup="' + attr.inputLookup + '"' +
					' class="form-control ' + (attr.inputClass ? attr.inputClass + '"' : '"') +
					(attr.hasOwnProperty('required')
						? (attr.hasOwnProperty('multiple') ? ' required-multiple="true"' : ' ng-required="true"')
						: '') +
					(attr.hasOwnProperty('multiple') ? ' multiple="multiple"' : '') +
					' lookup-options="{openOnEnter: false' +
						(attr.inputLookupOptions ?  + ', ' + attr.inputLookupOptions : '') + '}"></input>';

				//margin-bottom in form is hack - strange margin from top on enter in edit mode
				//can't fix another
				var tmpl =
	'<div inline-edit="' + attr.model + '">' +
	'	<span ng-hide="editMode" ng-click="edit()" class="editable">' + viewTmpl + '<inline-none></inline-none></span>' +
	'	<form name="editForm" ng-show="editMode" ng-class="{\'has-error\': editForm.$invalid}" style="width: 100%; margin-bottom: 0px" novalidate>' +
	'		<div class="input-group ' + (attr.inputCol ? ' ' + attr.inputCol : '') + '" style="padding-left: 0px">' +
	editTmpl +
	'		<inline-buttons class="input-group-btn" style="vertical-align: top"></inline-buttons>' +
	'		</div>' +
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

					var $input = $('input', elm);
					//select2 has self specific blur
					$input.off('blur', scope.onBlur);

					$input.on('select2-blur', scope.onBlur);
					$input.on('select2-opening', function(e) {
						$input.off('select2-blur', scope.onBlur);
					});
					$input.on('select2-close', function(e) {
						//if attach without timeout, blur handled right after close
						$timeout(function() {
							$input.on('select2-blur', scope.onBlur);
							//console.log('lookup focused: %s', $input.is(':focus'));
							if (!attr.hasOwnProperty('multiple')) {
								scope.onBlur();
							} else {
								// $timeout(function() {
								// 	console.log('close select2Change: %s', scope.select2Change);
								// 	if (!angular.isDefined(scope.select2Change) || scope.select2Change === false) {
								// 		//scope.onBlur();
								// 	}
								// }, 10);
								//console.log('lookup focused: %s', $input.is(':focus'));
							}
						});
						return false;
					});
					$input.on('select2-focus', function(e) {
						$(this).select2('open');
					});
					// $input.on('change', function(e) {
					// 	scope.select2Change = true;
					// 	console.log('change select2Change: %s', scope.select2Change);
					// });
					//enter and esc handling does not work, because of killEvent in select2 code
				}, 50);
			}
		};
	}]);
});