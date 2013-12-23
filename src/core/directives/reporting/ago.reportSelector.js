define([
	'../../moduleDef',
	'jquery',
	'angular',
	'text!./ago.reportSelector.tpl.html',
	'text!./ago.reportSelectorModal.tpl.html'
], function (module, $, angular , tpl, modalTpl) {
	module.directive('agoReportSelector', 
		['$stateParams', 'reportService', 'i18n', '$q', '$modal',
		function($stateParams, reportService, i18n, $q, $modal) {

		return {
			restrict: 'E',
			replace: true,
			template: tpl,
			scope: {
				types: '=reportTypes',
				onGetParams: '&',
				onError: '&'
			},
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				//in link function interpolation extract empty value, move i18n assigment here
				$scope.i18n = $rootScope.i18n;
			}],
			link: function(scope, elm, attrs) {

				var handleError = function(error) {
					if (angular.isFunction(scope.onError)) {
						scope.onError({error: error});	
					} else {
						console.log('Error when requesting report settings or run report: ' + error);
					}
					return false;
				};

				scope.runReport = function(modalResult) {
					var parameters = {
						serviceId: modalResult.service.id,
						settingsId: modalResult.setting.Id,
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
						template: modalTpl,
						resolve: {
							services: function() {
								return reportService.getServices().catch(handleError);
							},
							settings: function() {
								return reportService.getReportSettings(scope.types).catch(handleError);
							}
						},
						controller: ['$scope', '$modalInstance', 'services', 'settings',
							function($scope, $modalInstance, services, settings) {
								services = services || []; //if error
								settings = settings || []; //if error
								$scope.services = services;
								$scope.settings = settings;
								$scope.service = services.length > 0 ? services[0] : null;
								$scope.setting = settings.length > 0 ? settings[0] : null;
								$scope.resultName = null;
								$scope.ok = function() {
									$modalInstance.close({
										service: $scope.service,
										setting: $scope.setting,
										resultName: $scope.resultName
									});
								};
								$scope.cancel = function () {
									$modalInstance.dismiss('cancel');
								};
								$scope.valid = function() {
									return $scope.service && $scope.service != null &&
										$scope.setting && $scope.setting != null;
								};
							}]
					});

					modalInstance.result.then(scope.runReport);
				};
			}
		};
	}]);
});