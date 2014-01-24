define([
	'module',
	'../moduleDef',
	'jquery',
	'angular',
	'socket.io-client'
], function(requireModule, module, $, angular) {

	module.factory('notificationService', ['$rootScope', 'AUTH_EVENTS', function($rootScope, AUTH_EVENTS) {

		var socket = null
			, token = null
			, offLogin = null
			, offLogout = null

			, emit = function(event, msg) {
				$rootScope.$apply(function() {
					var reportTask = JSON.parse(msg);
					$rootScope.$emit(event, {report: reportTask});
				});
			}
		
			, disconnect = function() {
				if (socket) {
					socket.disconnect();
					socket = null;
					token = null;
				}
			}

			, connect = function(url) {
				//force need because disconnect not work if this option is false
				socket = io.connect(url + '?token=' + token, {'force new connection': true});
				socket.on('reports_changed', function (data) { 
					emit('reports:changed', data);
				});
				socket.on('reports_deleted', function (data) { 
					emit('reports:deleted', data);
				});
			};

		return {
			start: function(url) {
				offLogin = $rootScope.$on(AUTH_EVENTS.LOGIN, function(e, args) {
					if (!socket || !token || token !== args.user.Token) {
						disconnect();
						token = args.user.Token;
						connect(url);
					}
				});

				offLogout = $rootScope.$on(AUTH_EVENTS.LOGOUT, function() {
					disconnect();
				});
			}, 

			stop: function() {
				if (offLogin) {
					offLogin();
					offLogin = null;
				}
				if (offLogout) {
					offLogout();
					offLogout = null;
				}
			}
		};
	}]);

	module.run(['apinetService', 'notificationService', '$rootScope',
	 function(apinetService, notificationService, $rootScope) {
		notificationService.start(apinetService.notificationRoot());
		$rootScope.$on('$destroy', function() {
			notificationService.stop()
		});
	}]);
});