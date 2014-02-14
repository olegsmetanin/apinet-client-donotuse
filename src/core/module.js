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

	'i18n!./nls/module'
], function(requireModule, module, require) {
	return module
		.value('strapConfig', {
			pickDate: true,
			pickTime: false,
			type: 'iso',
			todayBtn: 'linked',
			todayHighlight: 'true'
		})
		.constant('startupPath', { url: ''})
		.config(['$locationProvider', '$urlRouterProvider', 'startupPath', 
			function ($locationProvider, $urlRouterProvider, startupPath) {

			$locationProvider.hashPrefix('!');
			$urlRouterProvider.otherwise(function($injector, $location) {
				//share info for sign in via oauth provider (see security.service for facebook and twitter)
				//because else we have return path as /projects/processing, but it is not are real startup path
				startupPath.url = $location.absUrl();
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
		.run(['$rootScope', '$state', '$stateParams', 'i18n', 'apinetService',
			function ($rootScope, $state, $stateParams, i18n, apinetService) {
				$rootScope.$state = $state;
				$rootScope.$stateParams = $stateParams;

				apinetService.action({ method: 'core/users/getLocale' }).then(function (locale) {
					if(locale && locale.length) {
						i18n.setLocale(locale);
					}
				}, function() {
					i18n.setLocale(null);
				});
			}
		]);
});