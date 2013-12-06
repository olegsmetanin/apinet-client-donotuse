define([
	'angular',
	'jquery-migrate',
	'angular-ui-router',
	'angular-ui-bootstrap3',
	'angular-promise-tracker',
	'i18n!core/nls/angular',
	'./security/module'
], function (angular) {
	return angular.module('core.module', ['ui.router', 'ui.bootstrap', 'core.security.module',
		'ajoslin.promise-tracker', 'ngLocale']);
});