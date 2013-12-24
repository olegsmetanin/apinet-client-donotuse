define([
	'../../moduleDef',
	'angular',
	'text!./ago.reportIcon.tpl.html'
], function (module, angular , tpl) {
	module.directive('agoReportIcon', [function() {
		return {
			restrict: 'EA',
			replace: true,
			template: tpl,
			scope: {
				report: '='
			},
			link: function(scope) {
				scope.classes = function() {
					var r = scope.report;
					return {
						'icon-bar-chart': r.State !== 'Running' && r.State !== 'NotStarted',
						'icon-cog': r.State === 'Running' || r.State === 'NotStarted',
						'icon-spin': r.State === 'Running',
						'text-success': r.State === 'Completed' && r.ResultUnread === true, 
						'text-info': r.State === 'Running' || r.State == 'NotStarted',
						'text-error': r.State === 'Error', 
						'text-warning': r.State === 'Canceled'
					}
				};
			}
		};
	}])
});
