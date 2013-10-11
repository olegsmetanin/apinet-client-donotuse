angular.module('core')
	.filter('applicableOps', ['filterHelpers', function($filterHelpers) {
		return function(input, metadata) {
			var result = [], i;
			if(!angular.isArray(input) || !metadata) {
				return result;
			}

			for (i = 0; i < input.length; i++) {
				if($filterHelpers.isOpApplicableToNode(input[i], metadata)) {
					result.push(input[i]);
				}
			}

			return result;
		};
	}]);