define(['../moduleDef', '../../components/angular-infrastructure'], function (module, angular) {
/**
 * Simple helper for select table rows with chekbox in the header.
 * Parametes set in object notation without braces.
 * @param items {string} property name in scope, that contains list of items. Default value 'items'.
 * @param prop {string} property name is items, that contains true/false selection flag. Defaul value 'selected'.
 * 
 * @example <th><input type="checkbox" checker="items: 'myModels', prop: 'selected'" /></th>...<tr ng-repeat="myModel in myModels"><td><input type="checkbox" ng-model="myModel.selected"
 */
	module.directive('checker', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var params = scope.$eval('{' + attrs.checker + '}');
				params.items = params.items || 'items';
				params.prop = params.prop || 'selected';

				angular.element(element).on('click', function(e) {
					var items = scope[params.items], len = items.length, checked = $(this).is(':checked');
					scope.$apply(function() {
						for(var i = 0; i < len; i++) {
							items[i][params.prop] = checked;
						}
					});
				});
			}
		};
	});
});