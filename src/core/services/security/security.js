// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.service', [
	'security.retryQueue', // Keeps track of failed requests that need to be retried once the user logs in
	'security.login', // Contains the login form template and controller
	'ui.bootstrap.modal' // Used to display the login form as a modal dialog.
])

.factory('security', ['$http', '$q', '$location', 'securityRetryQueue', '$modal', 'userGroups', 'sysConfig', 'coreConfig', 'moduleConfig',
			'apinetService', function($http, $q, $location, queue, $modal, userGroups, sysConfig, coreConfig, moduleConfig, apinetService) {

		// Redirect to the given url (defaults to '/')
		function redirect(url) {
			url = url || '/';
			$location.path(url);
			window.location.href = '/';
		}

		// Login form dialog stuff
		var loginDialog = null;

		function openLoginDialog() {
			if (loginDialog) {
				return;
			}
			loginDialog = $modal.open({
				templateUrl: sysConfig.src('core/parts/loginform/form.tpl.html'), 
				controller: 'LoginFormController'});
			loginDialog.result.then(onLoginDialogClose);
		}

		function closeLoginDialog(success) {
			if (loginDialog) {
				loginDialog.close(success);
			}
		}

		function onLoginDialogClose(success) {
			loginDialog = null;
			if (success) {
				queue.retryAll();
			} else {
				queue.cancelAll();
				redirect();
			}
		}

		// Register a handler for when an item is added to the retry queue
		queue.onItemAddedCallbacks.push(function() {
			if (queue.hasMore()) {
				service.showLogin();
			}
		});

		// The public API of the service
		var service = {

			// Get the first reason for needing a login
			getLoginReason: function() {
				return queue.retryReason();
			},

			// Show the modal login dialog
			showLogin: function() {
				openLoginDialog();
			},

			// Attempt to authenticate a user by the given email and password
			login: function(email, password) {
				service.currentUser = null;
				service.currentUserGroups = null;

				var deferred = $q.defer();

				apinetService.action({
					method: 'core/auth/login',
					email: email,
					password: password
				})
				.then(function(result) {
					if(typeof result.success === 'undefined' || result.success) {
						service.currentUser = result;
						if (service.isAuthenticated()) {
							closeLoginDialog(true);
						}
					}

					deferred.resolve(result);
				}, function(error) {
					deferred.resolve(error);
				});

				return deferred.promise;
			},

			// Give up trying to login and clear the retry queue
			cancelLogin: function() {
				closeLoginDialog(false);
				redirect();
			},

			// Logout the current user and redirect
			logout: function(redirectTo) {
				$http.post('/api/core/auth/logout').then(function() {
					service.currentUser = null;
					redirect(redirectTo);
				});
			},

			// Ask the backend to see if a user is already authenticated - this may be from a previous session.
			requestCurrentUser: function() {
				if (service.isAuthenticated()) {
					return $q.when(service.currentUser);
				}
				else {
					return $http.post('/api/core/auth/currentUser').then(function(response) {
						service.currentUser = response.data;
						if(service.currentUser) {
							service.currentUser.admin = service.currentUser.SystemRole === 'Administrator';
						}
						return service.currentUser;
					});
				}
			},

			// Information about the current user
			currentUser: null,
			currentUserGroups: userGroups,

			// Is the current user authenticated?
			isAuthenticated: function() {
				return !!service.currentUser;
			},

			// Is the current user an adminstrator?
			isAdmin: function() {
				return !!(service.currentUser && service.currentUser.admin);
			},

			//Ask the backend about user groups in provided project
			requestUserGroups: function(proj) {
				if (!service.isAuthenticated()) {
					return service.requestCurrentUser().then(function() {
						return $http.post('/user-groups', {
							project: proj
						}).then(function(response) {
							service.currentUserGroups = response.data.groups;
							return service.currentUserGroups;
						});
					});
				} else if (service.currentUserGroups !== null) {
					return $q.when(userGroups);
				} else {
					return $http.post('/user-groups', {
						project: proj
					}).then(function(response) {
						service.currentUserGroups = response.data.groups;
						return service.currentUserGroups;
					});
				}
			},

			//Ask the backend about user roles in provided project
			requestUserRole: function(project) {

				function getRole() {
					return moduleConfig.getRole(project)
						.then(function(role) {
							return role;
						});
				}

				if (!service.isAuthenticated()) {
					return service.requestCurrentUser().then(getRole);
				} else {
					return getRole();
				}
			}
		};

		return service;
	}
]);