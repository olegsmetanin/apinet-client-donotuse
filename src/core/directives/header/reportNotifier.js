define([
	'../../moduleDef',
	'angular',
	'text!./reportNotifier.tpl.html'
], function (module, angular, tpl) {
	module.directive('reportNotifier', ['security', 'reportService', '$timeout', '$rootScope',
		function(security, reportService, $timeout, $rootScope) {
			return {
				template: tpl,
				restrict: 'EA',
				replace: true,
				scope: true,
				link: function($scope) {

					$scope.reports = {
						count: 0,
						running: [],
						completed: [],

						showRunning: false,
						showCompleted: false,
						updating: false,

						clear: function() {
							this.running = [];
							this.completed = [];
						},

						refresh: function() {
							this.showRunning = this.running.length > 0;
							this.showCompleted = this.completed.length > 0;
							if (this.running.length > 0) {
								this.count =  this.running.length
							} else {
								//need only completed and unread
								this.count = 0;
								for(var i = 0; i < this.completed.length; i++) {
									if (this.completed[i].State === 'Completed' && 
										this.completed[i].ResultUnread === true) {
										this.count++;
									}
								}
							}
						}
					};

					var handleException = function(error) {
						$scope.reports.updating = false;
						console.log('Error in report notifier: %s', error);
					};

					var isRunning = function(report) {
						return report && report.State &&
							report.State === 'NotStarted' || report.State === 'Running';
					};

					$scope.update = function() {
						$scope.reports.updating = true;

						reportService.getTopLastReports()
						.then(function(response) {

							$scope.reports.clear();

							for (var i = 0; i < response.length; i++) {
								if (isRunning(response[i])) {
									$scope.reports.running.push(response[i]);
								} else {
									$scope.reports.completed.push(response[i]);
								}
							}

							$scope.reports.refresh();
							$scope.reports.updating = false;
						}, handleException);
					};

					$rootScope.$on('reports:newReport', function(e) {
						$scope.reports.running.push(e.report);
						$scope.reports.refresh();

						$scope.update();
					});

					$scope.cancel = function(report) {
						reportService.cancelReport(report.Id).
							then(function() {
								var reportIndex = $scope.reports.running.indexOf(report);
								if (reportIndex >= 0) {
									$scope.reports.running.splice(reportIndex, 1);
								}
								$scope.reports.refresh();

								$scope.update();
							}, handleException);
					};

					$scope.whenDownload = function(report) {
						$scope.reports.refresh();
					};

					$scope.update();
				}
			};
		}
	]);
});