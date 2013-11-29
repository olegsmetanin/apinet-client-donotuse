define([
	'angular',
	'angular-ui-bootstrap3',
	'angular-ui-router',
	'angular-ui-select2',
	'angular-promise-tracker',
	'./security/module'
], function (angular) {
	return angular.module('ago.core', [
		'ui.router', 'ui.bootstrap', 'ago.core.security',
		'ajoslin.promise-tracker', 'ui.select2'
	]);
});