define(['core/moduleDef'], function (module) {
	module.run(['i18n', function(i18n) {
		i18n.registerLocalizationModule('core/nls/bootstrap_datepicker');
	}]);

	module.service('core/nls/bootstrap_datepicker/en', ['strapConfig', function(strapConfig) {
		return function() {
			strapConfig.format = 'mm/dd/yyyy';
			strapConfig.language = 'en';
		};
	}]);
});