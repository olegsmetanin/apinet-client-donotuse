define([
	'../../moduleDef',
	'angular',
	'text!./ago.reportLink.tpl.html'
], function (module, angular , tpl) {
	module.directive('agoReportLink', ['reportService', function(reportService) {
		return {
			restrict: 'EA',
			replace: true,
			template: tpl,
			scope: {
				report: '=',
				downloadCallback: '&onDownload'
			},
			link: function(scope) {
				scope.downloadUrl = function() {
					return reportService.reportDownloadUrl(scope.report.ProjectCode, scope.report.Id);
				};

				scope.onDownload = function() {
					scope.report.ResultUnread = false;
					scope.downloadCallback({report: scope.report});
				};
			}
		};
	}])
});
