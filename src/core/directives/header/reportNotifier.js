define([
	'../../moduleDef',
	'angular',
	'text!./reportNotifier.tpl.html'
], function (module, angular, tpl) {
	module.directive('reportNotifier', 
		['security', 'reportService', '$timeout', '$rootScope', 'REPORT_EVENTS', 'REPORT_STATES', 
		function(security, reportService, $timeout, $rootScope, REPORT_EVENTS, REPORT_STATES) {

			return {
				template: tpl,
				restrict: 'EA',
				replace: true,
				scope: true,
				link: function($scope) {

					$scope.reports = {
						count: {
							active: 0,
							unread: 0
						},
						active: [],
						completed: [],

						showActive: false,
						showCompleted: false,
						updating: false,

						clear: function() {
							this.count.active = 0;
							this.count.unread = 0;
							this.active = [];
							this.completed = [];
						},

						refresh: function() {
							this.showActive = this.active.length > 0;
							this.showCompleted = this.completed.length > 0;
						},

						find: function(id, lookActive) {
							if (!id) return null;

							var reports = lookActive ? this.active : this.completed;
							for(var i = 0; i < reports.length; i++) {
								if (reports[i].Id === id) return reports[i];
							}
							return null;
						},

						remove: function(id, fromActive) {
							var forDelete = this.find(id, fromActive);
							if (forDelete) {
								var items = fromActive ? this.active : this.completed;
								var idx = items.indexOf(forDelete);
								items.splice(idx, 1);
								return true;
							}
							return false;
						}
					};

					var handleException = function(error) {
						$scope.reports.updating = false;
						console.log('Error in report notifier: %s', error);
					};

					var isRunning = function(report) {
						return report && report.State &&
							report.State === REPORT_STATES.NotStarted || 
							report.State === REPORT_STATES.Running;
					};

					$scope.update = function() {
						$scope.reports.updating = true;

						reportService.getTopLastReports()
						.then(function(response) {

							$scope.reports.clear();
							$scope.reports.count.active = response.active;
							$scope.reports.count.unread = response.unread;

							for (var i = 0; i < response.reports.length; i++) {
								if (isRunning(response.reports[i])) {
									$scope.reports.active.push(response.reports[i]);
								} else {
									$scope.reports.completed.push(response.reports[i]);
								}
							}

							$scope.reports.refresh();
							$scope.reports.updating = false;
							$scope.updatePromise = null;
						}, handleException);
					};

					$scope.updatePromise = null;

					$scope.throttleUpdate = function() {
						if ($scope.updatePromise) {
							$timeout.cancel($scope.updatePromise);
						}

						$scope.updatePromise = $timeout($scope.update, 300);
					};

					$scope.merge = function(e, arg) {
						var newReport = arg.report;
						var existed = $scope.reports.find(newReport.Id, true);
						if (existed) {
							angular.extend(existed, newReport);
							$scope.reports.refresh();
							return;
						}

						existed = $scope.reports.find(newReport.Id, false);
						if (existed) {
							angular.extend(existed, newReport);
							$scope.reports.refresh();
							return;
						}
						//if no in our top list - simply ignore
					};

					$rootScope.$on(REPORT_EVENTS.CREATED, $scope.throttleUpdate);
					$rootScope.$on(REPORT_EVENTS.RUNNED, $scope.merge);
					$rootScope.$on(REPORT_EVENTS.PROGRESS, $scope.merge);
					$rootScope.$on(REPORT_EVENTS.COMPLETED, $scope.throttleUpdate);
					$rootScope.$on(REPORT_EVENTS.ABORTED, $scope.throttleUpdate);
					$rootScope.$on(REPORT_EVENTS.ERROR, $scope.throttleUpdate);
					$rootScope.$on(REPORT_EVENTS.CANCELED, $scope.throttleUpdate);
					$rootScope.$on(REPORT_EVENTS.DELETED, $scope.throttleUpdate);
					$rootScope.$on(REPORT_EVENTS.DOWNLOADED, $scope.throttleUpdate);

					$scope.cancel = function(report) {
						reportService.cancelReport(report.Id).
							then(function() {
								$scope.reports.remove(report.Id, true);
								$scope.reports.refresh();
							}, handleException);
					};

					$scope.update();
				}
			};
		}
	]);
});