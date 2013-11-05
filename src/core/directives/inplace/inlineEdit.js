define(['angular', '../../moduleDef', 'css!./inlineEdit.css'], function (angular, module) {
	module.directive('inlineNone', function () {
		return {
			restrict: 'E',
			replace: true,
			template: '<small ng-show="isEmpty() && !editMode" class="text-muted"><em>{{ i18n.core.labels.none }}</em></small>'
		};
	})
		.directive('inlineEdit', ['$timeout', '$parse', '$q', function ($timeout, $parse, $q) {
			return {
				restrict: 'A',
				scope: true,
				link: function (scope, element, attr) {
					scope.emodel = {
						original: null,
						value: null
					};
					scope.editMode = false;
					scope.isChanged = false;
					scope.waiting = false;
					scope.elInput = scope.elInput || //<-- can be provided from aggregate directives
						element.find('input, textarea, select');

					var callback = function (cb) {
						if (cb) {
							return $parse(cb)(scope, {val: scope.emodel.value});
						}
						return true;
					};
					var unwatch = null;

					scope.edit = function () {
						if (scope.editForm) {
							scope.editForm.$setPristine();
						}
						scope.emodel.original = scope.emodel.value = scope.$eval(attr.inlineEdit);
						scope.editMode = true;
						callback(attr.onBeginEdit);

						$timeout(function () {
							scope.elInput.focus();
						}, 0, false);
						unwatch = scope.$watch('emodel.value', function () {
							scope.isChanged = !angular.equals(scope.emodel.value, scope.emodel.original);
							if(scope.isChanged) {
								callback(attr.onChanged);
							}
						}, true);
					};

					scope.update = function () {
						if (scope.editForm && scope.editForm.$invalid) {
							return;
						}
						//return undefined or true - success. Anything else - error, stay in edit mode
						scope.waiting = true;
						$q.when(callback(attr.onUpdate))
							.then(function (result) {
								scope.waiting = false;
								if (!angular.isDefined(result) || result === true) {
									unwatch();
									scope.editMode = scope.isChanged = false;
								}
							}, function () {
								scope.waiting = false;
							});
					};

					scope.cancel = function () {
						unwatch();
						callback(attr.onCancel);
						scope.emodel.value = scope.emodel.original;
						scope.editMode = scope.isChanged = false;
					};

					scope.cancelEnabled = function () {
						return scope.isChanged && !scope.waiting;
					};

					scope.updateEnabled = function () {
						return scope.isChanged && !scope.waiting && !(scope.editForm && scope.editForm.$invalid);
					};

					scope.isEmpty = function () {
						var value = scope.$eval(attr.inlineEdit);
						return angular.isUndefined(value) ||
							(angular.isArray(value) && value.length === 0) ||
							value === '' ||
							value === null ||
							value !== value;
					};

					scope.onBlur = function (e) {
						if (!scope.isChanged) {
							scope.$apply(scope.cancel);
						}
					};

					angular.element(scope.elInput).on('keydown', function (e) {
						var isTextArea = $(scope.elInput).is('textarea');
						var isSubmit = isTextArea
							? (e.ctrlKey || e.metaKey) && e.keyCode === 13
							: e.keyCode === 13;
						var isEsc = e.keyCode === 27;

						if (isSubmit) {
							scope.$apply(scope.update);
						} else if (isEsc) {
							scope.$apply(scope.cancel);
						}
						return true;
					});

					angular.element(scope.elInput).on('blur', scope.onBlur);
				}
			};
		}]);
});