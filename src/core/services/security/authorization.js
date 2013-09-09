angular.module('security.authorization', ['security.service'])

// This service provides guard methods to support AngularJS routes.
// You can add them as resolves to routes to require authorization levels
// before allowing a route change to complete
	.provider('securityAuthorization', function () {

		this.requireGroups = function (groups) {
			return ['securityAuthorization', function (securityAuthorization) {
				return securityAuthorization.requireGroups(groups);
			}];
		};

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


		this.$get = ['security', 'securityRetryQueue', 'sysConfig', function (security, queue, sysConfig) {
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
				requireGroups: function (requiredGroups) {
					var promise = security.requestUserGroups(sysConfig.project).then(function (groups) {
						var found = false;
						for (var groupIndex = 0; groupIndex < requiredGroups.length; groupIndex++) {
							var requiredGroup = requiredGroups[groupIndex];
							if ($.inArray(requiredGroup, groups) >= 0) {
								found = true;
								break;
							}
						}
						if (!found) {
							//reason not analized in security service, no matter
							return queue.pushRetryFn('unauthorized-client', function () {
								return service.requireGroups(requiredGroups);
							});
						}
					});
					return promise;
				},

				// Require that there is an authenticated user, current project,
				// and current user in any of requested groups of current project
				requireRoles: function (requiredRoles) {
					var promise = security.requestUserRole(sysConfig.project).then(function (role) {
						var found = requiredRoles.indexOf(role) !== -1;
						if (!found) {
							//reason not analized in security service, no matter
							return queue.pushRetryFn('unauthorized-client', function () {
								return service.requireRoles(requiredRoles);
							});
						}
					});
					return promise;
				}



			};

			return service;
		}];
	});