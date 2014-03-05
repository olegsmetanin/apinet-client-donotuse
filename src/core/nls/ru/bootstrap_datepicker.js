define(['core/moduleDef', 'jquery', 'jquery-ui'], function (module, $) {
	module.run(['i18n', function(i18n) {
		i18n.registerLocalizationModule('core/nls/bootstrap_datepicker');
	}]);

	module.service('core/nls/bootstrap_datepicker/ru', ['$datepickerProvider', function($datepickerProvider) {
		return function() {
			$datepickerProvider.defaults.lang = 'ru';

			// strapConfig.format = 'dd.mm.yyyy';
			// strapConfig.language = 'ru';

			// $.fn.datepicker.dates['ru'] = {
			// 	days: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота", "Воскресенье"],
			// 	daysShort: ["Вск", "Пнд", "Втр", "Срд", "Чтв", "Птн", "Суб", "Вск"],
			// 	daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
			// 	months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
			// 	monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
			// 	today: "Сегодня",
			// 	weekStart: 1
			// };
		};
	}]);
});