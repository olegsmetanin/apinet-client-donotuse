define([
	'../../moduleDef',
	'jquery',
	'angular',
	'text!./ago.reportSelector.tpl.html'
], function (module, $, angular , tpl) {
	module.directive('agoReportSelector', 
		['$stateParams', 'reportService', 'i18n', '$q',
		function($stateParams, reportService, i18n, $q) {

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
				//scope.i18n = i18n;
				scope.reports = [];

				var handleError = function(error) {
					if (angular.isFunction(scope.onError)) {
						scope.onError({error: error});	
					} else {
						console.log('Error when requesting report settings or run report: ' + error);
					}
				};

				reportService.getReportSettings(scope.types)
				.then(function(response) {
					scope.reports = response;
				}, handleError);

				scope.runReport = function(settings) {
					var parameters = {
						settingsId: settings.Id,
						parameters: null
					};

					var call = null;
					if (angular.isFunction(scope.onGetParams)) {
						call = $q.when(scope.onGetParams({settings: settings, parameters: parameters }));
					} else {
						call = $q.when(parameters);
					}

					call.then(function() {
						reportService.runReport(parameters, handleError);
					});
				};
			}
		};
	}]);
});