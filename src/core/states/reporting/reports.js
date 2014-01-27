define([
	'../../moduleDef',
	'angular',
	'text!./reports.tpl.html'
], function (module, angular, template) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state({
			name: 'page.reporting.reports',
			url: '/projects/reporting/reports',
			onEnter: function(pageConfig, i18n) {
				pageConfig.setConfig({
					breadcrumbs: [{
						name: i18n.msg('core.reporting.reports.title'),
						url: 'page.reporting.reports'
					}]
				});
			},
			template: template
		});
	}])
	.controller('reportsController', 
		['$scope', 'apinetService', '$window', 'i18n', 'reportService', '$locale', '$rootScope', 'REPORT_EVENTS',
		function($scope, apinetService, $window, i18n, reportService, $locale, $rootScope, REPORT_EVENTS) {

			var handleException = function(error) {
				$scope.resetValidation();
				$scope.validation.generalErrors = angular.isArray(error) ? error : [error];
			};

			var pluralDurationPart = function(cnt, type, omitZero) {
				if (omitZero && cnt <= 0) {
					return '';
				}

				switch($locale.pluralCat(cnt)) {
					case 'one':
					case 'few':
					case 'many':
					case 'other':
						var pcat = $locale.pluralCat(cnt);
						return cnt + ' ' + i18n.msg('core.reporting.reports.duration.' + type + '.' + pcat);
					case 'zero':
					case 'two':
					default:
						return '';
				}
			};

			$scope.duration = function(report) {
				if (!report.StartedAt) {
					return '';
				}

				var finish = report.CompletedAt ? new Date(report.CompletedAt) : new Date();
				var start = new Date(report.StartedAt);

				//TODO: needs UTC??() daylight savings)
				var f = Date.UTC(finish.getFullYear(), finish.getMonth(), finish.getDate(),
					finish.getHours(), finish.getMinutes(), finish.getSeconds());
				var s = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(),
					start.getHours(), start.getMinutes(), start.getSeconds());
				var ms = Math.abs(f-s);
				//TODO: to consts?
				var MS_PER_SECOND = 1000,
					MS_PER_MINUTE = MS_PER_SECOND * 60,
					MS_PER_HOUR = MS_PER_MINUTE * 60;

				var hoursDiff = Math.floor(ms/MS_PER_HOUR);
				var minutesDiff = Math.floor((ms - (hoursDiff * MS_PER_HOUR))/MS_PER_MINUTE);
				var secondsDiff = Math.floor((ms - (hoursDiff * MS_PER_HOUR + minutesDiff * MS_PER_MINUTE))/MS_PER_SECOND);

				var secondsName = i18n.msg('core.reporting.reports.duration.seconds');
				var hours = pluralDurationPart(hoursDiff, 'hours', true);
				return	hours + ' ' + pluralDurationPart(minutesDiff, 'minutes', hours === '') +
					(secondsDiff > 0 ? ' ' + secondsDiff + ' ' + secondsName : '< 1 ' + secondsName);
			};

			$scope.cancel = function(report) {
				reportService.cancelReport(report.Id)
					.then(null, handleException);
			};

			var findById = function(id) {
				if (!id) return null;

				for(var i = 0; i < $scope.models.length; i++) {
					if ($scope.models[i].Id == id) {
						return $scope.models[i];
					}
				}

				return null;
			};

			var deleteReport = function(id) {
				var report = findById(id);
				if (!report) return;

				var reportIndex = $scope.models.indexOf(report);
				if (reportIndex >= 0) {
					$scope.models.splice(reportIndex, 1);
				}
			}

			$scope.merge = function(e, arg) {
				var changedReport = arg.report;
				var report = findById(changedReport.Id);
				if (!report) return;

				angular.extend(report, changedReport);
			};

			$scope.delete = function(report) {
				if (!$window.confirm(i18n.msg('core.confirm.delete.record'))) {
					return;
				}

				reportService.deleteReport(report.Id)
					.then(function() {
						deleteReport(report.Id);
					}, handleException);
			};

			$rootScope.$on(REPORT_EVENTS.CREATED, function(e, arg) {
				$scope.models.unshift(arg.report);
			});
			$rootScope.$on(REPORT_EVENTS.RUNNED, $scope.merge);
			$rootScope.$on(REPORT_EVENTS.PROGRESS, $scope.merge);
			$rootScope.$on(REPORT_EVENTS.COMPLETED, $scope.merge);
			$rootScope.$on(REPORT_EVENTS.ABORTED, $scope.merge);
			$rootScope.$on(REPORT_EVENTS.ERROR, $scope.merge);
			$rootScope.$on(REPORT_EVENTS.CANCELED, $scope.merge);
			$rootScope.$on(REPORT_EVENTS.DELETED, function(e, arg) {
				deleteReport(arg.report.Id);
			});
			$rootScope.$on(REPORT_EVENTS.DOWNLOADED, $scope.merge);
		}]
	);
});
