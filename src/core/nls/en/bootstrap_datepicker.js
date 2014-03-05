define(['core/moduleDef'], function (module) {
	module.run(['i18n', function(i18n) {
		i18n.registerLocalizationModule('core/nls/bootstrap_datepicker');
	}]);

	module.service('core/nls/bootstrap_datepicker/en', ['$datepickerProvider', function($datepickerProvider) {
		return function() {
			$datepickerProvider.defaults.lang = 'en';
		};
	}]);
});