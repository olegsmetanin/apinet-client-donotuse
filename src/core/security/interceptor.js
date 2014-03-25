define(['./moduleDef'], function (module) {
	module.factory('securityInterceptor', ['$injector', 'securityRetryQueue', function ($injector, queue) {
		return function (promise) {
			// Intercept failed requests
			return promise.then(null, function (originalResponse) {
				if (originalResponse.status === 401) {
					// The request bounced because it was not authorized - add a new request to the retry queue
					promise = queue.pushRetryFn('unauthorized-server', function retryRequest() {
						// We must use $injector to get the $http service to prevent circular dependency
						if(originalResponse.config) {
							return $injector.get('$http')(originalResponse.config);
						}
						else {
							return $injector.get('apinetService').performRequest(originalResponse.corsConfig);
						}
					});
				} else if (originalResponse.status === 403 || originalResponse.status === 500) {
					// The request is forbidden. Try to find reason and if foune-route to special error page
					var data = originalResponse.data ? JSON.parse(originalResponse.data) : null;
					if (data) {
						var $state = $injector.get('$state');
						var errorPageService = $injector.get('errorPageService');
						var reason = null;
						var reasonTitle = null;

						if (!!data.accessDenied) {
							reasonTitle = 'core.errors.accessDeniedTitle';
							reason = 'core.errors.accessDenied';
						} else if (!!data.invalidProject) {
							reasonTitle = 'core.errors.invalidProjectTitle';
							reason = 'core.errors.invalidProject';
						}

						errorPageService.setError(reason, reasonTitle);

						$state.go('page.projects.accessDenied');
					}
				}
				return promise;
			});
		};
	}])

	// We have to add the interceptor to the queue as a string because the interceptor depends upon service instances that are not available in the config block.
	.config(['$httpProvider', function ($httpProvider) {
		$httpProvider.defaults.useXDomain = true;
		$httpProvider.defaults.withCredentials = true;
		delete $httpProvider.defaults.headers.common['X-Requested-With'];
		$httpProvider.responseInterceptors.push('securityInterceptor');
	}]);
});