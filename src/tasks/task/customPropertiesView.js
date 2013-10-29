angular.module('tasks')
.directive('customProperties', ['sysConfig', '$rootScope', 'apinetService', '$window', '$filter',
	function(sysConfig, $rootScope, apinetService, $window, $filter) {

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
				value: null,
				focused: false
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
				return $scope.editables.type === null || $scope.editables.value === null ||
					($scope.isStr() && $scope.form.str.$invalid) || 
					($scope.isNum() && $scope.form.num.$invalid) || 
					($scope.isDate() && $scope.form.dt.$invalid);
			};

			$scope.valueToString = function(param) {
				switch(param.Type.ValueType) {
					case 'String':
						return param.Value;
					case 'Number':
						return param.Value;
					case 'Date':
						return $filter('date')(param.Value, 'ago_date');
					default:
						console.log('Error when extract param value: %s - %s', param.Type.ValueType, param.Value);
						return '';
				}
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
						//$scope.editables.type = null;
						$scope.editables.value = null;
						$scope.resetValidation();
						$scope.model.Parameters.unshift(result.model);
					} else {
						handleValidationErrors(result.validation);
					}
				}, handleException);
			};

			$scope.delete = function(param) {
				if (!$window.confirm($scope.i18n.msg('core.confirm.delete.record'))) {
					return;
				}

				apinetService.action({
					method: 'tasks/tasks/DeleteParam',
					paramId: param.Id })
				.then(function() {
					var modelIndex = $scope.model.Parameters.indexOf(param);
					if (modelIndex >= 0) {
						$scope.model.Parameters.splice(modelIndex, 1);
					}
				}, handleException);
			};

			$scope.resetValidation();
		}]
	}
}]);