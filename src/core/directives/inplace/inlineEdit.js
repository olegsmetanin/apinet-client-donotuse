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
			var elInput = element.find('input')[0] || 
                element.find('textarea')[0] ||
                element.find('select')[0];

            var callback = function(cb) {
                if (cb) {
                    $parse(cb)(scope, {val: scope.emodel.value});
                }
            };

			scope.edit = function() {
				scope.editMode = true;
				scope.emodel.original = scope.emodel.value = scope.$eval(attr.inlineEdit);
				$timeout(function() { elInput.focus(); }, 0, false);
			};

			scope.update = function() {
				if (scope.editForm && scope.editForm.$invalid) {
					return;
				}
				scope.editMode = false;
                callback(attr.onUpdate);
			};

			scope.cancel = function() {
				scope.editMode = false;
				scope.emodel.value = scope.emodel.original;
                callback(attr.onCancel);
			};

		    angular.element(elInput).on('keydown', function(e) {
		    	var isTextArea = $(elInput).is('textarea');
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
		    angular.element(elInput).on('blur', function(e) {
		    	//scope.$apply(scope.update);	
		    });
		}
	};
}]);