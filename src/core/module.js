define([
	'module',
	'./moduleDef',
	'./services',
	'./directives',
	'./states',

	'../components/flatty/theme',
	'i18n!nls/angular',
	'i18n!ago/nls/core',

	'css!ago/core/assets/form.css',
	'css!ago/core/assets/list.css',
	'css!ago/core/assets/tags.css'
], function(requireModule, module) {
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