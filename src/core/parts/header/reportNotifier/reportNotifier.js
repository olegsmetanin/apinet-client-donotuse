angular.module('core')
	.directive('reportNotifier', ['security', 'sysConfig', 'reportService', '$timeout',
		function(security, sysConfig, reportService, $timeout) {
			var directive = {
				templateUrl: sysConfig.src('core/parts/header/reportNotifier/reportNotifier.tpl.html'),
				restrict: 'EA',
				replace: true,
				scope: true,
				link: function($scope, $element, $attrs, $controller) {

					$scope.showGenerating = false;

					$scope.showDone = false;

					$scope.badge = '';

					$scope.updating = false;


					function update() {
						var reports = reportService.getUnreadUserReports(),
							generating = [],
							done = [];
						for (var i = 0; i < reports.length; i++) {
							if (reports[i].Status === 'done') {
								done.push(angular.copy(reports[i]));
							} else {
								generating.push(angular.copy(reports[i]));
							}
						}

						$timeout(function() {

							$scope.generating = generating;
							$scope.showGenerating = generating.length !== 0;
							$scope.done = done;
							$scope.showDone = done.length !== 0;
							$scope.badge = (generating.length === 0 ? (done.length === 0 ? '' : done.length) : generating.length + '/' + done.length);

						});

						$scope.updating = false;
					}

					$scope.$on('events:unreadReportsChanged', function() {
						update();

					});

					$scope.updateUnreadUserReports = function() {

						$scope.updating = true;
						reportService.updateUnreadUserReports();

					};

					$scope.cancelReportGeneration = function(index) {
						reportService.cancelReportGeneration($scope.reports.gen[index].name);
					};

					update();

				}
			};
			return directive;
		}
	]);