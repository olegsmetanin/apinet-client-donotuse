angular.module('tasks')
.directive('statusHistory', ['sysConfig', '$rootScope', 'taskStatuses', '$locale', 
	function(sysConfig, $rootScope, taskStatuses, $locale) {

	return {
		restrict: 'EA',
		replace: true,
		templateUrl: sysConfig.src('tasks/task/statusHistoryView.tpl.html'),
		scope: {
			model: '=',
			onChange: '=change'
		},
		link: function(scope, elm, attr) {
			scope.i18n = $rootScope.i18n;
			scope.historyCollapsed = false;

			var pluralDurationPart = function(cnt, type, omitZero) {
				if (omitZero && cnt <= 0) return '';

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

				var days = pluralDurationPart(daysDiff, 'days', true);
				return	days + ' ' + 
						pluralDurationPart(hoursDiff, 'hours', days === '') + 
						(minutesDiff > 0 
							? ' ' + minutesDiff + ' ' + scope.i18n.msg('tasks.view.statusHistory.duration.minutes')
							: '');
			};

			scope.changeStatus = function(hrecord) {
				if (angular.isFunction(scope.onChange)) {
					scope.onChange(hrecord);
				}
			};

			scope.statusIcon = function(status) {
				switch(status) {
					case taskStatuses.NotStarted:
						return 'icon-time';
					case taskStatuses.InWork:
						return 'icon-cogs';
					case taskStatuses.Completed:
						return 'icon-ok';
					case taskStatuses.Closed:
						return 'icon-beer';
					case taskStatuses.Suspended:
						return 'icon-pause';
					default:
						return '';
				}
			};

			scope.statusColor = function(status) {
				switch(status) {
					case taskStatuses.NotStarted:
						return 'btn-danger';
					case taskStatuses.InWork:
						return 'btn-primary';
					case taskStatuses.Completed:
						return 'btn-warning';
					case taskStatuses.Closed:
						return 'btn-success';
					case taskStatuses.Suspended:
						return 'btn-inverse';
					default:
						return '';
				}	
			};
		}
	}
}]);