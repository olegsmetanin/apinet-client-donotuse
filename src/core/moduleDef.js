define([
	'../components/angular-infrastructure',
	'./security/module'
], function (angular) {
	return angular.module('ago.core', ['ui.router', 'ui.bootstrap', 'ago.core.security', 'ajoslin.promise-tracker']);
});