define([
	'module',
	'./moduleDef',
	'moment',
	'jquery-migrate',
	'jquery-ui',
	'./services',
	'./directives',
	'./states',
	'./filters',

	'css!./assets/form.css',
	'css!./assets/list.css',
	'css!./assets/bootstrap-hidden-display-fix.css',

	'i18n!./nls/angular',
	'i18n!./nls/moment',
	'i18n!./nls/module'
], function (requireModule, module, moment) {
	return module
		.config(['$datepickerProvider', function ($datepickerProvider) {
			angular.extend($datepickerProvider.defaults, {
				dateType: 'iso',
				dateFormat: 'ago_date',
				autoclose: true,
				useNative: true,
				container: 'body' //пока под вопросом надо ли это
			});
		}])
  		.config(['$uiViewScrollProvider', function($uiViewScroll) {
  			//http://code.agosystems.com/issues/1773#note-6
  			//important, don't remove or test, that browser don't scroll content below fixed menu
  			//when ui-sref link clicked (tabs in task view and others)
  			$uiViewScroll.useAnchorScroll ();
  		}])
		.constant('startupPath', { url: ''}) //for tracking between redirects
		.config(['$locationProvider', '$urlRouterProvider', 'startupPath',
			function ($locationProvider, $urlRouterProvider, startupPath) {

				$locationProvider.hashPrefix('!');
				$urlRouterProvider.otherwise(function ($injector, $location) {
					//share info for sign in via oauth provider (see security.service for facebook and twitter)
					//because else we have return path as /projects/processing, but it is not are real startup path
					startupPath.url = $location.absUrl();
					var url = $location.url();
					var path = $location.path().toLowerCase();
					var parts = path.split('/');
					if (parts.length) {
						if (!parts[0]) {
							parts.shift();
						}
						if (parts[0] === 'project' && parts[1]) {
							var apinetService = $injector.get('apinetService');
							var $state = $injector.get('$state');
							var $timeout = $injector.get('$timeout');


							var $rootScope = $injector.get('$rootScope');
							$rootScope.breadcrumbsHidden = true;

							apinetService.getModel({
								method: 'core/projects/projectInfo',
								project: parts[1]
							}).then(function (data) {
									if (!data || !data.Module) {
										return;
									}
									var m = data.Module.toLowerCase();
									require([m], function () {
										require([m + '/module'], function () {
											$timeout(function () {
												$location.url(url);
											});
										});
									});
								}, function () {
									$rootScope.breadcrumbsHidden = false;
									$state.go('page.projects.projectsList');
								});
							return '/projects/processing';
						}
					}
					return '/projects/listview';
				});
			}])
		.run(['$rootScope', '$state', '$stateParams', 'i18n', 'apinetService', '$locale',
			function ($rootScope, $state, $stateParams, i18n, apinetService, $locale) {
				/*var oldFn = module.value;
				module.value = function( name, value ) {
					if(name === '$locale') {
						name = '$locale_' + i18n.locale;
					}

					return oldFn(name, value);
				};*/

				$rootScope.$state = $state;
				$rootScope.$stateParams = $stateParams;
				$rootScope.moment = moment;

				apinetService.action({ method: 'core/users/getLocale' }).then(function (locale) {
					if (locale && locale.length) {
						i18n.setLocale(locale);
					}
				}, function () {
					i18n.setLocale(null);
				});
			}
		]);
});