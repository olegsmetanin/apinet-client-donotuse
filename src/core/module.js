define([
	'module',
	'./moduleDef',
	'require',
	'./services',
	'./directives',
	'./states',
	'./filters',

	'css!./assets/form.css',
	'css!./assets/list.css',
	'css!./assets/tags.css',

	'i18n!./nls/module'
], function(requireModule, module, require) {
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
			$urlRouterProvider.otherwise(function($injector, $location) {
				var url = $location.url();
				var path = $location.path().toLowerCase();
				var parts = path.split('/');
				if(parts.length) {
					if(!parts[0]) {
						parts.shift();
					}
					if(parts[0] === 'project' && parts[1]) {
						var apinetService = $injector.get('apinetService');
						var $state = $injector.get('$state');
						var $timeout = $injector.get('$timeout');

						apinetService.getModel({
							method: 'core/projects/projectInfo',
							project: parts[1]
						}).then(function(data) {
							if(!data || !data.Module) {
								return;
							}
							require([data.Module + '/module'], function() {
								$timeout(function() { $location.url(url); });
							});
						}, function() {
							$state.go('page.projects.projectsList');
						});
						return '/projects/processing';
					}
				}
				return '/projects/listview';
			});
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