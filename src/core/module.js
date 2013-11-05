define([
	'./moduleDef',
	'module',
	'./services',
	'./directives',
	'./states',

	'ago/components/flatty/javascripts/theme',
	'i18n!nls/angular',
	'i18n!ago/nls/core'
], function(module, requireModule) {
	return module.constant('sysConfig', requireModule.config().sysConfig)
	.value('strapConfig', {
		language: 'en',
		pickDate: true,
		pickTime: false,
		type: 'iso',
		todayBtn: 'linked',
		todayHighlight: 'true'
	})
	.config(['$locationProvider', function ($locationProvider) {
		$locationProvider.hashPrefix('!');
	}])
	.run(['$rootScope', '$state', '$stateParams', 'security', 'strapConfig', 'sysConfig',
		function ($rootScope, $state, $stateParams, security, strapConfig, sysConfig) {
			$rootScope.$state = $state;
			$rootScope.$stateParams = $stateParams;

			strapConfig.language = sysConfig.lang;
			//security.requestCurrentUser();
		}
	]);
});