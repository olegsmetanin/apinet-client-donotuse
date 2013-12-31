define([
	'module',
	'../moduleDef',
	'jquery',
	'angular',
	'signalR'
], function(requireModule, module, $, angular, signalR) {
	var config = requireModule.config() || { };
	config.signalRRoot = config.signalRRoot ? config.signalRRoot : '/signalR';

	module.factory('notificationService', ['$rootScope', function($rootScope) {

		var connection = $.hubConnection(config.signalRRoot, { useDefaultPath: false });
		//connection.logging = true;
		var notificationsHub = connection.createHubProxy('notificationsHub');
		notificationsHub.on('onReportChanged', function(task) {
			console.log('SignalR notification event recieved: %s', task);
			$rootScope.$emit('reports:changed', {report: task});
		});

		return {
			start: function(login) {
				connection.qs = {'login': login };
				connection.start();
			}, 

			stop: function() {
				connection.stop();
			}
		};

	}]);

	module.run(['security', 'notificationService', function(security, notificationService) {
		 if (security.isAuthenticated()) {
		 	notificationService.start(security.currentUser.Login);
		 };
	}]);
});