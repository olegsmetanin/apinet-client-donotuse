define([
	'../../moduleDef',
	'angular',
	'text!./reports.tpl.html'
], function (module, angular, template) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state({
			name: 'page.projects.reports',
			url: '/projects/reports',
			template: template,
			onEnter: function($rootScope) {
				$rootScope.breadcrumbs.push({
					name: 'core.reporting.reports.title',
					url: 'page.projects.reports'
				});
			},
			onExit: function($rootScope) {
				$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
			}
		});
	}])
	.controller('reportsController', 
		['$scope', 'apinetService', '$window', 'i18n', 'reportService', '$locale', '$rootScope', 'REPORT_EVENTS',
		function($scope, apinetService, $window, i18n, reportService, $locale, $rootScope, REPORT_EVENTS) {
			$scope.downloadUrl = function(archiveRecord) {
				return reportService.reportDownloadUrl(archiveRecord.ProjectCode, archiveRecord.ReportTaskId);
			};
		}]
	);
});
