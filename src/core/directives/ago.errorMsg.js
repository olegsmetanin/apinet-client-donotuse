angular.module('core')
.directive('agoErrorMsg', function () {
	return {
		restrict: 'E',
		replace: true,
		template: function(elm, attr) {
			return '<div class="alert alert-danger alert-dismissable" ng-show="validation.generalErrors">' +
				'	<a class="close" data-dismiss="alert" href="#">&times;</a>' +
				'		<i class="icon-remove-sign"></i>' +
				'		{{ validation.generalErrors | joinBy }}' +
				'</div>';
		}
	};
});