define(['../../moduleDef'], function (module) {
	module.directive('inlineLookup', ['$timeout', function ($timeout) {
		return {
			restrict: 'E',
			replace: true,
			transclude: true,
			template: function (elm, attr) {
				var viewTmpl = attr.hasOwnProperty('multiple') ?
					'<div style="display: inline-block" ng-transclude></div>' : '{{ ' + attr.model + '.text }}';

				var editTmpl = '<input type="text" ng-model="emodel.value" ng-readonly="waiting"' +
					' lookup="' + attr.inputLookup + '"' +
					' class="form-control ' + (attr.inputClass ? attr.inputClass + '"' : '"') +
					(attr.hasOwnProperty('required') ? (attr.hasOwnProperty('multiple') ?
						' required-multiple="true"' : ' ng-required="true"') : '') +
					(attr.hasOwnProperty('multiple') ? ' multiple="multiple"' : '') +
					' lookup-options="{openOnEnter: false' +
					(attr.inputLookupOptions ? +', ' + attr.inputLookupOptions : '') + '}"></input>';

				//margin-bottom in form is hack - strange margin from top on enter in edit mode
				//can't fix another
				return '<div inline-edit="' + attr.model + '">' +
					'	<span ng-hide="editMode" ng-click="edit()" class="editable">' + viewTmpl + '<inline-none></inline-none></span>' +
					'	<form name="editForm" ng-show="editMode" ng-class="{\'has-error\': editForm.$invalid}" style="width: 100%; margin-bottom: 0px" novalidate>' +
					'		<div class="input-group ' + (attr.inputCol ? ' ' + attr.inputCol : '') + '" style="padding-left: 0px">' +
					editTmpl +
					'		<inline-buttons class="input-group-btn" style="vertical-align: top"></inline-buttons>' +
					'		</div>' +
					'	</form>' +
					'</div>';
			},
			link: function (scope, elm, attr) {
				//select2 not initialized if call without timeout
				$timeout(function () {
					//inplaceEdit use this for focus() when enter in edit mode
					scope.elInput = attr.hasOwnProperty('multiple') ?
						$('input.select2-input', elm) : $('.select2-focusser', elm);

					scope.onFocus = function () {
						$(this).select2('open');
					};

					var $input = $('input', elm);
					//select2 has self specific blur
					$input.off('blur', scope.onBlur);

					$input.on('select2-blur', scope.onBlur);
					$input.on('select2-focus', scope.onFocus);

					$input.on('select2-opening', function () {
						$input.off('select2-blur', scope.onBlur);
						$input.off('select2-focus', scope.onFocus);
					});
					$input.on('select2-close', function () {
						$timeout(function () {
							$input.on('select2-blur', scope.onBlur);
							$input.on('select2-focus', scope.onFocus);

							if (!attr.hasOwnProperty('multiple')) {
								scope.onBlur();
							}
						});
						return false;
					});
				}, 50);
			}
		};
	}]);
});