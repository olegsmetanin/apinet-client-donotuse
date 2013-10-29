angular.module('tasks')
.directive('customProperties', ['sysConfig', '$rootScope', 'apinetService', function(sysConfig, $rootScope, apinetService) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: sysConfig.src('tasks/task/customPropertiesView.tpl.html'),
		scope: {
			model: '='
		},
		link: function(scope) {
			scope.i18n = $rootScope.i18n;
		},
		controller: ['$scope', function($scope) {
			$scope.editables = { 
				type: null,
				value: null
			};

			var isValueTypeMatch = function(needed) {
				return $scope.editables.type && $scope.editables.type.ValueType === needed;
			};

			$scope.$watch('editables.type', function(){
				$scope.editables.value = null;
			}, true);

			$scope.isNum = function() {
				return isValueTypeMatch('Number');
			};

			$scope.isStr = function() {
				return isValueTypeMatch('String');
			};

			$scope.isDate = function() {
				return isValueTypeMatch('Date');
			};

			$scope.hasAddError = function() {
				return ($scope.isStr() && $scope.form.str.$invalid) || 
					($scope.isNum() && $scope.form.num.$invalid) || 
					($scope.isDate() && $scope.form.dt.$invalid);
			};

			$scope.resetValidation = function() {
				$scope.validation = { };
			};

			var handleException = function(error) {
				$scope.resetValidation();
				$scope.validation.generalErrors = [error];
			};

			var handleValidationErrors = function(validation) {
				$scope.resetValidation();
				angular.extend($scope.validation, validation);
			};

			$scope.add = function() {
				apinetService.action({
					method: 'tasks/tasks/EditParam',
					taskId: $scope.model.Id,
					model: {
						type: { id: $scope.editables.type.id },
						value: $scope.editables.value
					}
				}).then(function(result) {
					if(result.validation.success) {
						$scope.editables.type = $scope.editables.validation = null;
						$scope.resetValidation();
						$scope.model.Parameters.unshift(result.model);
					} else {
						handleValidationErrors(result.validation);
					}
				}, handleException);
			};

			$scope.resetValidation();
		}]
	}
}]);