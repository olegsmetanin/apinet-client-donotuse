angular.module('core')
    .directive('inlineEdit', ['$timeout', function($timeout) {
    	return {
    		restrict: 'A',
            scope: true,
    		link: function(scope, element, attr) {
    			scope.emodel = { 
    				model: scope.$eval(attr.editModel),
    				original: null,
    				value: null
    			};
    			scope.editMode = false;
    			var elInput = element.find('input')[0];

    			scope.edit = function() {
    				scope.editMode = true;
    				scope.emodel.original = scope.emodel.value = scope.$eval(attr.inlineEdit);
    				$timeout(function() {
    					elInput.focus();
    				}, 0, false);
    			};

    			scope.update = function() {
    				scope.editMode = false;
    				var handler = scope.$eval(attr.onUpdate);
    				if (angular.isDefined(handler))
    					handler({ model: scope.emodel.model, value: scope.emodel.value });
    			};

    			scope.cancel = function() {
    				scope.editMode = false;
    				scope.emodel.value = scope.emodel.original;
    				var handler = scope.$eval(attr.onCancel);
    				if (angular.isDefined(handler))
    					handler({ model: scope.emodel.model, value: scope.emodel.value });
    			};

    			angular.element(elInput).on('keypress', function(e) {
			    	if (e.keyCode === 13) {
			    		scope.$apply(scope.update);
			    	}
			    });

			    angular.element(elInput).on('keydown', function(e) {
			    	if (e.keyCode === 27) {
			    		scope.$apply(scope.cancel);
			    	}
			    });
    		}
    	};
    }]);