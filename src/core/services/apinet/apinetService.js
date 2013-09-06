angular.module('core')
	.service('apinetService', ['$q', '$http', '$cacheFactory', function ($q, $http, $cacheFactory) {
		angular.extend(this, {
			getModel: function (requestData, postProcessFn) {
				var deferred = $q.defer();
				var cache;

				if(requestData.cacheable && requestData.modelType && requestData.id) {
					cache = $cacheFactory.get(requestData.modelType) || $cacheFactory(requestData.modelType);
					var cachedModel = cache.get(requestData.id);
					if(cachedModel) {
						deferred.resolve(cachedModel);
						return deferred.promise;
					}
				}

				$http.post('/api/' + requestData.method, requestData)
					.success(function (data) {
						if (data) {
							if(angular.isFunction(postProcessFn)) {
								data = postProcessFn(data);
								data = data ? data : { };
							}

							if(requestData.cacheable) {
								cache = cache ? cache :	$cacheFactory.get(
									requestData.modelType) || $cacheFactory(requestData.modelType);
								cache.put(requestData.id, data);
							}

							deferred.resolve(data);
							return;
						}
						deferred.reject('Error: ' + (data.message ? data.message : 'unknown error'));
					})
					.error(function (data, status) {
						deferred.reject(data && data.message ? data.message : 'Error: ' + status);
					});
				return deferred.promise;
			},

			getModels: function (requestData, postProcessRowsFn) {
				var deferred = $q.defer();
				$http.post('/api/' + requestData.method, requestData)
					.success(function (data) {
						if (data && angular.isArray(data.rows)) {
							if(angular.isFunction(postProcessRowsFn)) {
								data.rows = postProcessRowsFn(data.rows);
								data.rows = angular.isArray(data.rows) ? data.rows : [];
							}
							deferred.resolve(data);
							return;
						}
						deferred.reject('Error: ' + (data.message ? data.message : 'unknown error'));
					})
					.error(function (data, status) {
						deferred.reject(data && data.message ? data.message : 'Error: ' + status);
					});
				return deferred.promise;
			},

			action: function (requestData) {
				var deferred = $q.defer();

				$http.post('/api/' + requestData.method, requestData)
					.success(function (data) {
						deferred.resolve(data || { success: true });
					})
					.error(function (data, status) {
						deferred.reject(data && data.message ? data.message : 'Error: ' + status);
					});

				return deferred.promise;
			}
		});
	}]);