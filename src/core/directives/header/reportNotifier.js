define([
	'../../moduleDef',
	'angular',
	'text!./reportNotifier.tpl.html'
], function (module, angular, tpl) {
	module.directive('reportNotifier', ['security', 'reportService', '$timeout',
		function(security, reportService, $timeout) {
			return {
				template: tpl,
				restrict: 'EA',
				replace: true,
				scope: true,
				link: function($scope) {

					$scope.reports = {
						count: 0,
						running: [],
						completed: []
					};

					$scope.state = {
						showRunning: false,
						showCompleted: false,
						updating: false,	
					};

					var handleException = function(error) {
						$scope.state.updating = false;
						console.log('Error in report notifier: %s', error);
					};

					var isRunning = function(report) {
						return report && report.State &&
							report.State === 'NotStarted' || report.State === 'Running';
					};

					$scope.update = function() {
						$scope.state.updating = true;

						reportService.getTopLastReports()
						.then(function(response) {

							$scope.reports.running = [];
							$scope.reports.completed = [];

							for (var i = 0; i < response.length; i++) {
								if (isRunning(response[i])) {
									$scope.reports.running.push(response[i]);
								} else {
									$scope.reports.completed.push(response[i]);
								}
							}

							$scope.state.showRunning = $scope.reports.running.length > 0;
							$scope.state.showCompleted = $scope.reports.completed.length > 0;
							$scope.reports.count = $scope.reports.running.length > 0
								? $scope.reports.running.length
								: $scope.reports.completed.length;
							$scope.state.updating = false;
						}, handleException);
					};

					$scope.$on('events:unreadReportsChanged', function() {
						$scope.update();
					});

					$scope.cancel = function(report) {
						//TODO
						//reportService.cancelReportGeneration($scope.reports.gen[index].name);
						console.log('Canceling report');
						console.log(report);
					};

					$scope.update();
				}
			};
		}
	]);
});