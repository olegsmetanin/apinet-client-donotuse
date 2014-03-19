define([
	'../moduleDef',
	'angular',
	'text!./agreementsView.tpl.html'
], function (module, angular, tpl) {
	module.directive('agreements', ['apinetService', '$window', 'i18n', '$rootScope', 'taskStatuses', '$stateParams',
		function(apinetService, $window, i18n, $rootScope, taskStatuses, $stateParams){
			return {
				restrict: 'E',
				template: tpl,
				scope: {
					model: '='
				},
				link: function($scope) {
					$scope.i18n = $rootScope.i18n;
					$scope.editables = {
						newAgreemer: null,
						dueDate: null,
						comment: null,
						state: null
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
							method: 'tasks/tasks/addAgreemer',
							project: $stateParams.project,
							taskId: $scope.model.Id,
							participantId: $scope.editables.newAgreemer.id,
							dueDate: $scope.editables.dueDate })
						.then(function(response) {
							$scope.model.Agreements.push(response);
							$scope.editables.newAgreemer = null;
							$scope.editables.dueDate = null;
							$scope.goToState(null);
						}, handleException);
					};

					$scope.removeAgreement = function(agreement) {
						if (!$window.confirm(i18n.msg('tasks.confirm.delete.agreemer'))) {
							return;
						}

						apinetService.action({
							method: 'tasks/tasks/removeAgreement',
							project: $stateParams.project,
							taskId: $scope.model.Id,
							agreementId: agreement.Id })
						.then(function(response) {
							if (response === true) {
								var index = $scope.model.Agreements.indexOf(agreement);
								if (index >= 0) {
									$scope.model.Agreements.splice(index, 1);
								}
							} else {
								handleException(i18n.msg('core.errors.nothingToDelete'));
							}
						}, handleException);
					};

					var doChange = function(params) {
						apinetService.action(params)
						.then(function(response) {
							var agr = null;
							angular.forEach($scope.model.Agreements, function(v, k) {
								if (v.Id === response.Id) {
									agr = v;
								}
							});
							if (agr) {
								angular.extend(agr, response);
							}
							$scope.goToState(null);
							// if (!$scope.editables.addState) {
							// 	$scope.toggleAgree();
							// }
						}, handleException);
					};

					$scope.agree = function() {
						doChange({
							method: 'tasks/tasks/agreeTask',
							project: $stateParams.project,
							taskId: $scope.model.Id,
							comment: $scope.editables.comment });
					};

					$scope.revoke = function() {
						doChange({
							method: 'tasks/tasks/revokeAgreement',
							project: $stateParams.project,
							taskId: $scope.model.Id });
					};

					$scope.goToState = function(state) {
						$scope.editables.state = state;
						if ($scope.editables.state === 'agree') {
							$scope.editables.comment = null;
						}
					};

					$scope.isAgreementsEditable = function() {
						return $scope.model && $scope.model.Status.id !== taskStatuses.Closed;
					};

					$scope.addAgreementAvailable = function() {
						return $scope.isAgreementsEditable() && $scope.editables.newAgreemer !== null;
					};
				}
			};
	}]);
});