angular.module('tasks')
.directive('customProperties', ['sysConfig', function(sysConfig) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: sysConfig.src('tasks/task/customPropertiesView.tpl.html'),
		scope: {
			model: '='
		}
	}
}]);