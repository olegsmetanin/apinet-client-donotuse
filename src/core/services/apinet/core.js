angular.module('core')
	.service("apinet", ['$q', '$http', function ($q, $http) {
		angular.extend(this, {
			getModels: function (requestData, postProcessRowsFn) {
				var deferred = $q.defer();
				$http.post("/api/models/", angular.extend({ action: 'getModels' }, requestData))
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
						deferred.reject('Error: ' + status);
					});
				return deferred.promise;
			}
		});
	}]);