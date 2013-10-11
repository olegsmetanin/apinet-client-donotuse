angular.module('tasks')
.directive('statusHistory', ['sysConfig', function(sysConfig) {
	return {
		restrict: 'E',
		replace: true,
		templateUrl: sysConfig.src('tasks/task/statusHistoryView.tpl.html'),
		scope: {
			model: '=',
			onChange: '=change'
		},
		link: function(scope, elm, attr) {
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

				//TODO: localization
				return '' + daysDiff + ' дней ' + hoursDiff + 'ч ' + minutesDiff + 'м';
			};

			scope.changeStatus = function(hrecord) {
				if (angular.isFunction(scope.onChange)) {
					scope.onChange(hrecord);
				}
			};
		}
	}
}]);