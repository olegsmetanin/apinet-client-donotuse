define([
	'./moduleDef',
	'module',
	'./services',
	'./directives',
	'./states',

	'ago/components/flatty/theme',
	'i18n!nls/angular',
	'i18n!ago/nls/core',

	'css!./assets/form.css',
	'css!./assets/list.css'
], function(module, requireModule) {
	var sysConfig = requireModule.config().sysConfig || { };

	return module.constant('sysConfig', sysConfig)
		.value('strapConfig', {
			language: sysConfig.lang,
			pickDate: true,
			pickTime: false,
			type: 'iso',
			todayBtn: 'linked',
			todayHighlight: 'true'
		})
		.config(['$locationProvider', function ($locationProvider) {
			$locationProvider.hashPrefix('!');
		}])
		.run(['$rootScope', '$state', '$stateParams', function ($rootScope, $state, $stateParams) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;
		}]);
});