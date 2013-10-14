angular.module('tasks')
.directive('agreements', ['apinetService', 'sysConfig', '$window', function(apinetService, sysConfig, $window){
	return {
		restrict: 'E',
		templateUrl: sysConfig.src('tasks/task/agreementsView.tpl.html'),
		scope: {
			model: '='
		},
		link: function($scope) {
			$scope.editables = { 
				newAgreemer: null,
				dueDate: null,
				comment: null,
				addState: true
			};

			$scope.resetValidation = function() {
				if (!$scope.validation) {
					$scope.validation = {};
				}
				$scope.validation.generalErrors = [];
				$scope.validation.fieldErrors = {};
			};

			var handleException = function(error) {
				$scope.resetValidation();
				$scope.validation.generalErrors = [error];
			};

			$scope.addAgreemer = function() {
				apinetService.action({
					method: 'tasks/tasks/AddAgreemer',
					taskId: $scope.model.Id,
					participantId: $scope.editables.newAgreemer.id,
					dueDate: $scope.editables.dueDate })
				.then(function(response) {
					$scope.model.Agreements.push(response);
					$scope.editables.newAgreemer = null;
					$scope.editables.dueDate = null;
				}, handleException);
			};

			$scope.removeAgreement = function(agreement) {
				if (!$window.confirm('Вы действительно хотите удалить согласующего?')) {
					return;
				}

				apinetService.action({
					method: 'tasks/tasks/RemoveAgreement',
					taskId: $scope.model.Id,
					agreementId: agreement.Id })
				.then(function(response) {
					if (response === 'true') {
						var index = $scope.model.Agreements.indexOf(agreement);
						if (index >= 0) {
							$scope.model.Agreements.splice(index, 1);	
						}
					} else {
						//TODO localize
						$scope.validation.generalErrors = ['No agreement found. Refresh page.'];
					}
				}, handleException);
			};

			var doChange = function(params) {
				apinetService.action(params)
				.then(function(response) {
					var agr = null;
					angular.forEach($scope.model.Agreements, function(v, k) {
						if (v.Id == response.Id) {
							agr = v;
						}
					});
					if (agr) {
						angular.extend(agr, response);
					}
					if (!$scope.editables.addState) {
						$scope.toggleAgree();
					}
				}, handleException);
			};

			$scope.agree = function() {
				doChange({
					method: 'tasks/tasks/AgreeTask',
					taskId: $scope.model.Id,
					comment: $scope.editables.comment });
			};

			$scope.revoke = function() {
				doChange({
					method: 'tasks/tasks/RevokeAgreement',
					taskId: $scope.model.Id });
			}

			$scope.toggleAgree = function() {
				$scope.editables.addState = !$scope.editables.addState;
				if ($scope.editables.addState) {
					$scope.editables.comment = null;
				}
			};

			$scope.isAgreementsEditable = function() {
				return $scope.model && $scope.model.Status.id !== 'Closed'; //TODO has rights
			};

			$scope.addAgreementAvailable = function() {
				return $scope.isAgreementsEditable() && $scope.editables.newAgreemer !== null; //TODO has rights
			};
		}
	};
}]);