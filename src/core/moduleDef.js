define([
	'angular',
	'jquery-migrate',
	'angular-ui-router',
	'angular-ui-bootstrap3',
	'angular-promise-tracker',
	'i18n!core/nls/angular',
	'./security/module',
	'blueimp-fileupload'
], function (angular) {
	var module = angular.module('core.module', ['ui.router', 'ui.bootstrap', 'core.security.module', 'ajoslin.promise-tracker', 'ngLocale', 'blueimp.fileupload'],
		function($controllerProvider, $compileProvider, $stateProvider, $provide) {
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