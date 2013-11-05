define([
	'angular',
	'angular-ui-bootstrap3',
	'angular-ui-router',

	'components/eternicode-bootstrap-datepicker/bootstrap-datepicker/js/bootstrap-datepicker',
	'components/select2-3.4.1/select2.min',
	'components/angular-promise-tracker-1.3.3/promise-tracker',
	'components/angular-ui-select2-0.0.2/src/select2',
	'components/moment/min/moment.min',
	'components/angular-moment-0.1.7/angular-moment.min',
	'components/spin.js/dist/spin',
	'components/angular-spinner-0.2.0/angular-spinner.min',
	'components/ngInfiniteScroll-PureJS/build/ng-infinite-scroll.min',
	
	'./security/module'
], function (angular) {
	return angular.module('ago.core', [
		'ui.router', 'ui.bootstrap', 'ago.core.security',
		'ajoslin.promise-tracker', 'angularMoment', 'angularSpinner',
		'ui.bootstrap.datepicker', 'ui.select2', 'infinite-scroll'
	]);
});