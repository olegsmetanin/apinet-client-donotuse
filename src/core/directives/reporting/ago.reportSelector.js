define([
	'../../moduleDef',
	'jquery',
	'angular',
	'text!./ago.reportSelector.tpl.html',
	'text!./ago.reportSelectorModal.tpl.html'
], function (module, $, angular , tpl, modalTpl) {
	module.directive('agoReportSelector', 
		['$stateParams', 'reportService', 'i18n', '$q', '$modal', 'REPORT_PRIORITY_TYPE', 
		function($stateParams, reportService, i18n, $q, $modal, REPORT_PRIORITY_TYPE) {

		return {
			restrict: 'E',
			replace: true,
			template: tpl,
			scope: {
				project: '=',
				types: '=reportTypes',
				onGetParams: '&',
				onError: '&'
			},
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				//in link function interpolation extract empty value, move i18n assigment here
				$scope.i18n = $rootScope.i18n;
				$scope.priorities = REPORT_PRIORITY_TYPE;
			}],
			link: function(scope, elm, attrs) {

				var handleError = function(error) {
					scope.error = error;

					if (angular.isFunction(scope.onError)) {
						scope.onError({error: error});	
					} else {
						console.log('Error when requesting report settings or run report: ' + error);
					}
					return false;
				};

				scope.runReport = function(modalResult) {
					var parameters = {
						project: $stateParams.project,
						settingsId: modalResult.setting.Id,
						priority: modalResult.priority,
						resultName: modalResult.resultName,
						parameters: null
					};

					var call = null;
					if (angular.isFunction(scope.onGetParams)) {
						call = $q.when(scope.onGetParams({settings: modalResult.setting, parameters: parameters }));
					} else {
						call = $q.when(parameters);
					}

					call.then(function() {
						reportService.runReport(parameters).catch(handleError);
					}, handleError);
				};

				scope.open = function() {
					var modalInstance = $modal.open({
						scope: scope,
						template: modalTpl,
						resolve: {
							settings: function() {
								return reportService.getReportSettings(scope.project, scope.types).catch(handleError);
							}
						},
						controller: ['$scope', '$modalInstance', 'settings',
							function($scope, $modalInstance, settings) {
								$scope.data = {};
								settings = settings || []; //if error

								angular.extend($scope.data, {
									settings: settings,
									setting: settings.length > 0 ? settings[0] : null,
									priority: REPORT_PRIORITY_TYPE.BY_DATE,
									resultName: null
								});

								$scope.ok = function() {
									$modalInstance.close({
										setting: $scope.data.setting,
										priority: $scope.data.priority,
										resultName: $scope.data.resultName
									});
								};
								$scope.cancel = function () {
									$modalInstance.dismiss('cancel');
								};
								$scope.valid = function() {
									return $scope.data.setting;
								};
								$scope.clearError = function() {
									$scope.error = null;
								};
							}]
					});

					modalInstance.result.then(scope.runReport);
				};
			}
		};
	}]);
});