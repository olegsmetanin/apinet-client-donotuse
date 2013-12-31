define(['./moduleDef', 'text!./loginForm.tpl.html'], function (module, loginFormTpl) {
	module.factory('security', ['$q', '$location', 'securityRetryQueue', '$modal', 'moduleConfig',
		'apinetService', 'notificationService', 

		function ($q, $location, queue, $modal, moduleConfig, apinetService, notificationService) {

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
					template: loginFormTpl,
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
			queue.onItemAddedCallbacks.push(function () {
				if (queue.hasMore()) {
					service.showLogin();
				}
			});

			// The public API of the service
			var service = {

				// Get the first reason for needing a login
				getLoginReason: function () {
					return queue.retryReason();
				},

				// Show the modal login dialog
				showLogin: function () {
					openLoginDialog();
				},

				// Attempt to authenticate a user by the given email and password
				login: function (email, password) {
					notificationService.stop();
					service.currentUser = null;
					service.currentUserGroups = null;

					var deferred = $q.defer();

					apinetService.action({
						method: 'core/auth/login',
						email: email,
						password: password
					})
					.then(function (result) {
						if (typeof result.success === 'undefined' || result.success) {
							service.currentUser = result;
							if (service.isAuthenticated()) {
								closeLoginDialog(true);
							};
							notificationService.start(service.currentUser.Login);
						}

						deferred.resolve(result);
					}, function (error) {
						deferred.reject(error);
					});

					return deferred.promise;
				},

				// Give up trying to login and clear the retry queue
				cancelLogin: function () {
					closeLoginDialog(false);
					redirect();
				},

				// Logout the current user and redirect
				logout: function (redirectTo) {
					apinetService.action({
						method: 'core/auth/logout'
					})
					.then(function () {
						notificationService.stop();
						service.currentUser = null;
						redirect(redirectTo);
					});
				},

				// Ask the backend to see if a user is already authenticated - this may be from a previous session.
				requestCurrentUser: function () {
					if (service.isAuthenticated()) {
						return $q.when(service.currentUser);
					}
					else {
						return apinetService.action({
							method: 'core/auth/currentUser'
						})
						.then(function (result) {
							if (typeof result.success === 'undefined' || result.success) {
								service.currentUser = result;
								notificationService.start(service.currentUser.Login);
								if (service.currentUser) {
									service.currentUser.admin = service.currentUser.SystemRole === 'Administrator';
								}
							}

							return service.currentUser;
						});
					}
				},

				// Information about the current user
				currentUser: {
					"Login": "admin@apinet-test.com",
					"Active": true,
					"Name": "John",
					"LastName": "Connor",
					"MiddleName": "",
					"FullName": "John Connor",
					"FIO": "Connor J.",
					"WhomFIO": null,
					"JobName": "Administrator",
					"WhomJobName": null,
					"SystemRole": "Administrator",
					"LastChangeTime": null,
					"ModelVersion": 1,
					"CreationTime": "2013-11-29T05:49:34.2Z",
					"Id": "6bb0c06f-cca5-4e47-98a3-a28500a1ee31",
					"Description": "UserModel: 6bb0c06f-cca5-4e47-98a3-a28500a1ee31"
				},
				currentUserGroups: [],

				// Is the current user authenticated?
				isAuthenticated: function () {
					return !!service.currentUser;
				},

				// Is the current user an adminstrator?
				isAdmin: function () {
					return !!(service.currentUser && service.currentUser.admin);
				},

				//Ask the backend about user roles in provided project
				requestUserRole: function (project) {

					function getRole() {
						return moduleConfig.getRole(project)
							.then(function (role) {
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
});