define(['./moduleDef'], function (module) {
	module.provider('securityAuthorization', function () {
		this.requireRoles = function (roles) {
			return ['securityAuthorization', function (securityAuthorization) {
				return securityAuthorization.requireRoles(roles);
			}];
		};

		this.requireAdminUser = function () {
			return ['securityAuthorization', function (securityAuthorization) {
				return securityAuthorization.requireAdminUser();
			}];
		};

		this.requireAuthenticatedUser = function () {
			return ['securityAuthorization', function (securityAuthorization) {
				return securityAuthorization.requireAuthenticatedUser();
			}];
		};


		this.$get = ['security', 'securityRetryQueue', '$stateParams', function (security, queue, $stateParams) {
			var service = {
				// Require that there is an authenticated user
				// (use this in a route resolve to prevent non-authenticated users from entering that route)
				requireAuthenticatedUser: function () {
					return security.requestCurrentUser().then(function (userInfo) {
						if (!security.isAuthenticated()) {
							return queue.pushRetryFn('unauthenticated-client', service.requireAuthenticatedUser);
						}
						return userInfo;
					});
				},

				// Require that there is an administrator logged in
				// (use this in a route resolve to prevent non-administrators from entering that route)
				requireAdminUser: function () {
					return security.requestCurrentUser().then(function (userInfo) {
						if (!security.isAdmin()) {
							return queue.pushRetryFn('unauthorized-client', service.requireAdminUser);
						}
						return userInfo;
					});
				},

				// Require that there is an authenticated user, current project,
				// and current user in any of requested groups of current project
				requireRoles: function (requiredRoles) {
					return security.requestUserRole($stateParams.project).then(function (role) {
						var found = requiredRoles.indexOf(role) !== -1;
						if (!found) {
							//reason not analized in security service, no matter
							return queue.pushRetryFn('unauthorized-client', function () {
								return service.requireRoles(requiredRoles);
							});
						}
					});
				}
			};

			return service;
		}];
	});
});