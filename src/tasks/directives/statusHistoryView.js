define([
	'../moduleDef',
	'../../components/angular-infrastructure',
	'text!./statusHistoryView.tpl.html'
], function (module, angular, tpl) {
	module.directive('statusHistory', ['sysConfig', '$rootScope', 'taskStatuses', '$locale',
		function(sysConfig, $rootScope, taskStatuses, $locale) {

		return {
			restrict: 'E',
			replace: true,
			template: tpl,
			scope: {
				model: '=',
				onChange: '=change'
			},
			link: function(scope, elm, attr) {
				scope.i18n = $rootScope.i18n;

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
							return cnt + ' ' + scope.i18n.msg('tasks.view.statusHistory.duration.' + type + '.' + pcat);
						case 'zero':
						case 'two':
						default:
							return '';
					}
				};

				scope.isClosedRecord = function(hrecord) {
					return hrecord.hasOwnProperty('Finish');
				};

				scope.duration = function(hrecord) {
					var finish = hrecord.Finish ? new Date(hrecord.Finish) : new Date();
					var start = new Date(hrecord.Start);

					//TODO: needs UTC??() daylight savings)
					var f = Date.UTC(finish.getFullYear(), finish.getMonth(), finish.getDate(),
						finish.getHours(), finish.getMinutes(), finish.getSeconds());
					var s = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate(),
						start.getHours(), start.getMinutes(), start.getSeconds());
					var ms = Math.abs(f-s);
					//TODO: to consts?
					var MS_PER_DAY = 1000 * 60 * 60 * 24;
					var MS_PER_HOUR = 1000 * 60 * 60;
					var MS_PER_MINUTE = 1000 * 60;

					var daysDiff = Math.floor(ms/MS_PER_DAY);
					var hoursDiff = Math.floor((ms - (daysDiff * MS_PER_DAY))/MS_PER_HOUR);
					var minutesDiff = Math.floor((ms - (daysDiff * MS_PER_DAY + hoursDiff * MS_PER_HOUR))/MS_PER_MINUTE);

					var minuteName = scope.i18n.msg('tasks.view.statusHistory.duration.minutes');
					var days = pluralDurationPart(daysDiff, 'days', true);
					return	days + ' ' + pluralDurationPart(hoursDiff, 'hours', days === '') +
						(minutesDiff > 0 ? ' ' + minutesDiff + ' ' + minuteName : '< 1 ' + minuteName);
				};

				scope.changeStatus = function(hrecord) {
					if (angular.isFunction(scope.onChange)) {
						scope.onChange(hrecord);
					}
				};

				scope.statusIcon = function(status) {
					switch(status) {
						case taskStatuses.New:
							return 'icon-time';
						case taskStatuses.Doing:
							return 'icon-cogs';
						case taskStatuses.Done:
							return 'icon-ok';
						case taskStatuses.Discarded:
							return 'icon-pause';
						case taskStatuses.Closed:
							return 'icon-beer';
						default:
							return '';
					}
				};

				scope.statusColor = function(status) {
					switch(status) {
						case taskStatuses.New:
							return 'btn-danger';
						case taskStatuses.Doing:
							return 'btn-primary';
						case taskStatuses.Done:
							return 'btn-warning';
						case taskStatuses.Discarded:
							return 'btn-inverse';
						case taskStatuses.Closed:
							return 'btn-success';
						default:
							return '';
					}
				};
			}
		};
	}]);
});