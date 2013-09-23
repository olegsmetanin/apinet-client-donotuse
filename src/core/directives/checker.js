/**
 * Simple helper for select table rows with chekbox in the header.
 * Applied to checkbox in table header.
 * Parametes set in object notation without braces.
 * @param container {string} jquery selector for container with rows checkboxes, typically table id
 * @param items {string} jquery selector for rows checkboxed
 * @param data {string} name of the attribute in row selector with row id. Optional. Default is data-itemid.
 * 
 * @example <table id="myTable">....<th><input type="checkbox" checker="container: '#myTable', items: '.myRowChecks'" /></th>...<tr><td><input type="checkbox" class="myRowChecks"
 */
angular.module('core')
	.directive('checker', function() {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var params = scope.$eval('{' + attrs.checker + '}');
				var $container = $(params.container);

				angular.element(element).on('click', function(e) {
					var items = $(params.items, $container)
					    , len = items.length
						, $chb = null
						, checked = $(this).is(':checked');
					scope.$apply(function() {
						for(var i = 0; i < len; i++) {
							$chb = $(items[i]);
							$chb.prop('checked', checked);
						}	
					});
				});
			}
		};
	});