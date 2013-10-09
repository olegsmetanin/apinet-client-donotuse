angular.module('core')
.directive('inlineEdit', ['$timeout', '$parse', function($timeout, $parse) {
	return {
		restrict: 'A',
        scope: true,
		link: function(scope, element, attr) {
			scope.emodel = { 
				original: null,
				value: null
			};
			scope.editMode = false;
			scope.isChanged = false;
			scope.elInput = scope.elInput || //<-- can be provided from aggregate directives
				element.find('input')[0] || 
                element.find('textarea')[0] ||
                element.find('select')[0];

            var callback = function(cb) {
                if (cb) {
                    $parse(cb)(scope, {val: scope.emodel.value});
                }
            };
            var unwatch = null;

			scope.edit = function() {
				if (scope.editForm) {
					scope.editForm.$setPristine();
				}
				scope.emodel.original = scope.emodel.value = scope.$eval(attr.inlineEdit);
				scope.editMode = true;
				$timeout(function() { 
					scope.elInput.focus(); 
				}, 0, false);
				unwatch = scope.$watch('emodel.value', function() {
					scope.isChanged = !angular.equals(scope.emodel.value, scope.emodel.original);
				}, true);
			};

			scope.update = function() {
				if (scope.editForm && scope.editForm.$invalid) {
					return;
				}
				unwatch();
                callback(attr.onUpdate);
                scope.editMode = scope.isChanged = false;
			};

			scope.cancel = function() {
				unwatch();
                callback(attr.onCancel);
				scope.emodel.value = scope.emodel.original;
				scope.editMode = scope.isChanged = false;
			};

			scope.onBlur = function(e) {
				if (!scope.isChanged) {
					scope.$apply(scope.cancel);
				}
			};

		    angular.element(scope.elInput).on('keydown', function(e) {
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