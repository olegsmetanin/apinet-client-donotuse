/**
 * Enhanced Select2 Dropmenus
 *
 * @AJAX Mode - When in this mode, your value will be an object (or array of objects) of the data used by Select2
 *     This change is so that you do not have to do an additional query yourself on top of Select2's own query
 * @params [options] {object} The configuration options passed to $.fn.select2(). Refer to the documentation
 */
angular.module('core').value('agoSelect2Config', {})
	.directive('agoSelect2', ['agoSelect2Config', '$timeout', '$rootScope', function (agoSelect2Config, $timeout, $rootScope) {
		var options = {};
		if (agoSelect2Config) {
			angular.extend(options, agoSelect2Config);
		}
		return {
			require: 'ngModel',
			compile: function (tElm, tAttrs) {
				var watch,
					repeatOption,
					repeatAttr,
					isSelect = tElm.is('select'),
					isMultiple = angular.isDefined(tAttrs.multiple);

				// Enable watching of the options dataset if in use
				if (tElm.is('select')) {
					repeatOption = tElm.find('option[ng-repeat], option[data-ng-repeat]');

					if (repeatOption.length) {
						repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
						watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop();
					}
				}

				return function (scope, elm, attrs, controller) {
					// instance-specific options
					var opts = angular.extend({}, options, scope.$eval(attrs.agoSelect2));

					// Convert from Select2 view-model to Angular view-model.
					var convertToAngularModel = function (select2_data) {
						if (opts.simple_tags) {
							var model = [];

							angular.forEach(select2_data, function (value) {
								model.push(value.id);
							});

							return model;
						}

						return select2_data;
					};

					// Convert from Angular view-model to Select2 view-model.
					var convertToSelect2Model = function (angular_data) {
						if (opts.simple_tags || !angular_data) {
							var model = [];

							angular.forEach(angular_data || [], function (value) {
								model.push({'id': value, 'text': value});
							});

							return model;
						}

						return angular_data;
					};

					if (isSelect) {
						// Use <select multiple> instead
						delete opts.multiple;
						delete opts.initSelection;
					}
					else if (isMultiple) {
						opts.multiple = true;
					}

					if (controller) {

						var renderValidationsFn = function() {
							var div = elm.prev();
							div.toggleClass('ng-invalid', !controller.$valid)
								.toggleClass('ng-valid', controller.$valid)
								.toggleClass('ng-invalid-required', !controller.$valid)
								.toggleClass('ng-valid-required', controller.$valid)
								.toggleClass('ng-dirty', controller.$dirty)
								.toggleClass('ng-pristine', controller.$pristine);
						};
						controller.$viewChangeListeners.push(renderValidationsFn);

						controller.$render = function () {
							renderValidationsFn();

							if (!isSelect && (opts.multiple || (!controller.$viewValue ||
								angular.isObject(controller.$viewValue)))) {
								elm.select2('data', opts.multiple ?
									convertToSelect2Model(controller.$viewValue) : controller.$viewValue);
								return;
							}

							elm.select2('val', controller.$viewValue);
						};

						// Watch the options dataset for changes
						if (watch) {
							scope.$watch(watch, function (newVal) {
								if (!newVal) {
									return;
								}
								// Delayed so that the options have time to be rendered
								$timeout(function () {
									elm.select2('val', controller.$viewValue);
									// Refresh angular to remove the superfluous option
									elm.trigger('change');
								});
							});
						}

						if (!isSelect) {
							// Set the view and model value and update the angular template manually for the ajax/multiple select2.
							elm.bind("change", function () {
								if (!$rootScope.$$phase) {
									scope.$apply(function () {
										controller.$setViewValue(convertToAngularModel(elm.select2('data')));
									});
								}
								else {
									controller.$setViewValue(convertToAngularModel(elm.select2('data')));
								}
							});

							if (opts.initSelection) {
								var initSelection = opts.initSelection;
								opts.initSelection = function (element, callback) {
									initSelection(element, function (value) {
										controller.$setViewValue(convertToAngularModel(value));
										callback(value);
									});
								};
							}
						}
					}

					elm.bind("$destroy", function () {
						elm.select2("destroy");
					});

					attrs.$observe('disabled', function (value) {
						elm.select2('enable', !value);
					});

					attrs.$observe('readonly', function (value) {
						elm.select2('readonly', !!value);
					});

					if (attrs.ngMultiple) {
						scope.$watch(attrs.ngMultiple, function () {
							elm.select2(opts);
						});
					}

					// Initialize the plugin late so that the injected DOM does not disrupt the template compiler
					$timeout(function () {
						elm.select2(opts);

						if(!controller) {
							return;
						}

						// Set initial value - I'm not sure about this but it seems to need to be there
						elm.val(controller.$viewValue);
						// important!
						controller.$render();

						// Not sure if I should just check for !isSelect OR if I should check for 'tags' key
						if (!opts.initSelection && !isSelect) {
							controller.$setViewValue(
								convertToAngularModel(elm.select2('data'))
							);
						}
					});
				};
			}
		};
	}]);