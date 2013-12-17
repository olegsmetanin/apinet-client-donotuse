define([
	'module',
	'./moduleDef',
	'./services',
	'./directives',
	'./states',

	'css!./assets/form.css',
	'css!./assets/list.css',
	'css!./assets/tags.css',

	'i18n!./nls/module',

	'./themes/flatty/theme'
], function(requireModule, module) {
	return module.value('strapConfig', {
			language: 'en',
			pickDate: true,
			pickTime: false,
			type: 'iso',
			todayBtn: 'linked',
			todayHighlight: 'true'
		})
		.config(['$locationProvider', '$urlRouterProvider', function ($locationProvider, $urlRouterProvider) {
			$locationProvider.hashPrefix('!');
			$urlRouterProvider.otherwise('/projects/listview');
		}])
		.run(['$rootScope', '$state', '$stateParams', '$locale', 'strapConfig',
			function ($rootScope, $state, $stateParams, $locale, strapConfig) {
				$rootScope.$state = $state;
				$rootScope.$stateParams = $stateParams;

				$locale.supportedLocales = ['en','ru'];
				strapConfig.language = $locale.id;
			}
		]);
});