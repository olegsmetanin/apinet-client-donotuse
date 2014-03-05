define([
	'angular',
	'jquery-migrate',
	'angular-resource',
	'angular-ui-router',
	'angular-ui-bootstrap3',
	'angular-promise-tracker',
	'angular-masonry',
	'lvl-dragdrop',
	'blueimp-fileupload',
	'./security/module',
	'./directives/datepicker/module',
	'i18n!core/nls/angular',
	'angular-animate'
], function (angular) {
	var module = angular.module('core.module', [
		'ngResource', 'ui.router', 'ui.bootstrap', 'ajoslin.promise-tracker', 'wu.masonry', 'blueimp.fileupload',
		'core.security.module', 'ngLocale', 'lvl.directives.dragdrop', 'ngAnimate', 'mgcrea.ngStrap.datepicker'
	], function($controllerProvider, $compileProvider, $stateProvider, $provide) {
			module.controller = function( name, constructor ) {
				$controllerProvider.register( name, constructor );
				return( this );
			};

			module.service = function( name, constructor ) {
				$provide.service( name, constructor );
				return( this );
			};

			module.factory = function( name, factory ) {
				$provide.factory( name, factory );
				return( this );
			};

			module.value = function( name, value ) {
				$provide.value( name, value );
				return( this );
			};

			module.constant = function( name, constant ) {
				$provide.constant( name, constant );
				return( this );
			};

			module.directive = function( name, factory ) {
				$compileProvider.directive( name, factory );
				return( this );
			};

			module.filter = function( name, factory ) {
				$provide.filter( name, factory );
				return( this );
			};

			module.state = function( state ) {
				$stateProvider.state( state );
				return( this );
			};
		}
	);

	return module;
});