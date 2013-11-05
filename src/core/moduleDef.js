define([
	'angular',
	'angular-ui-bootstrap3',
	'angular-ui-router',
	'angular-ui-select2',
	'angular-promise-tracker',

	/*'components/moment/min/moment.min',
	'components/angular-moment-0.1.7/angular-moment.min',
	'components/spin.js/dist/spin',
	'components/angular-spinner-0.2.0/angular-spinner.min',*/

	'./security/module'
], function (angular) {
	return angular.module('ago.core', [
		'ui.router', 'ui.bootstrap', 'ago.core.security',
		'ajoslin.promise-tracker', 'ui.select2'
	]);
});