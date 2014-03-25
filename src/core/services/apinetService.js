define([
	'module',
	'../moduleDef',
	'angular',
	'easyXDM'
], function (requireModule, module, angular, easyXDM) {
	var config = requireModule.config() || { };
	config.apiRoot = config.apiRoot ? config.apiRoot : '/';
	config.notificationRoot = config.notificationRoot ? config.notificationRoot : 'http://localhost:36653';
	config.useEasyXDM = !angular.isDefined(config.useEasyXDM) || config.useEasyXDM;

	var corsRpc = config.useEasyXDM ? new easyXDM.Rpc({
		remote: config.apiRoot + 'cors/'
	}, {
		remote: {
			request: { }
		}
	}) : null;

	module.constant('defaultPageSize', 20);

	module.service('apinetService', ['$q', '$http', '$cacheFactory', 'i18n', 'securityInterceptor', function ($q, $http, $cacheFactory, i18n, securityInterceptor) {
		angular.extend(this, {
			performRequest: function(cfg, timeout) {
				cfg = cfg || { };

				var deferred = $q.defer();

				var requestData = angular.extend({ }, cfg.requestData);
				if(!requestData || !requestData.method) {
					deferred.reject('Inconsistent request');
					return deferred.promise;
				}

				var successFn = angular.isFunction(cfg.successFn) ? cfg.successFn : function() { };
				var failureFn = angular.isFunction(cfg.failureFn) ? cfg.failureFn : function() { };

				var method = requestData.method;
				delete requestData.method;

				if(!corsRpc) {
					var httpCfg = timeout != null ? {timeout: timeout} : null;
					$http.post(config.apiRoot + 'api/' + method, requestData, httpCfg)
						.success(function(data) {
							try {
								deferred.resolve(successFn(data));
							}
							catch(e) {
								deferred.reject(e);
							}
						})
						.error(function(data, status) {
							try {
								deferred.resolve(failureFn(data, status));
							}
							catch(e) {
								deferred.reject(e);
							}
						});

					return deferred.promise;
				}
				else {
					var JSON = easyXDM.getJSONObject();
					var data = {};

					for(var key in requestData) {
						if(!requestData.hasOwnProperty(key)) {
							continue;
						}
						if (requestData[key] === null) {
							continue; //nulls in form fields request does not handle rigth on server side
						}
						data[key] = angular.isObject(requestData[key]) ?
							JSON.stringify(requestData[key]) : requestData[key];
					}

					var requestCfg = {
						url: '../api/' + method,
						method: 'POST',
						data: data
					};
					if (timeout) {
						requestCfg['timeout'] = timeout;
					}

					corsRpc.request(requestCfg, function(response) {
						response.corsConfig = angular.extend({ }, cfg);

						try {
							deferred.resolve(successFn(response.data ? JSON.parse(response.data) : response.data));
						}
						catch(e) {
							deferred.reject(e);
						}
					}, function(response) {
						var responseData = response.data || { };
						responseData.corsConfig = angular.extend({ }, cfg);

						try {
							if(responseData.status !== 401 && responseData.status !== 403 && responseData.status !== 404) {
								deferred.resolve(failureFn(responseData.data ? JSON.parse(responseData.data) : responseData.data,
									responseData.status ? responseData.status : 500));
							}
							else {
								throw responseData;
							}
						}
						catch(e) {
							deferred.reject(e);
						}
					});

					return securityInterceptor(deferred.promise);
				}
			},

			getModel: function (requestData, postProcessFn) {
				var cache;

				if(requestData.cacheable && requestData.modelType && requestData.id) {
					cache = $cacheFactory.get(requestData.modelType) || $cacheFactory(requestData.modelType);
					var cachedModel = cache.get(requestData.id);
					if(cachedModel) {
						var deferred = $q.defer();
						deferred.resolve(cachedModel);
						return deferred.promise;
					}
				}

				return this.performRequest({
					requestData: requestData,
					successFn: function (data) {
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

							return data;
						}
						throw i18n.msg('core.errors.unknown');
					},
					failureFn: function (data, status) {
						throw data && data.message ? data.message : i18n.msg('core.errors.title') + ': ' + status;
					}
				});
			},

			getModels: function (requestData, postProcessRowsFn) {
				return this.performRequest({
					requestData: requestData,
					successFn: function (data) {
						if (angular.isArray(data)) {
							if(angular.isFunction(postProcessRowsFn)) {
								data = postProcessRowsFn(data);
								data = angular.isArray(data) ? data : [];
							}
							return data;
						}
						throw data && data.message ? data.message : i18n.msg('core.errors.unknown');
					},
					failureFn: function (data, status) {
						throw data && data.message ? data.message : i18n.msg('core.errors.title') + ': ' + status;
					}
				});
			},

			action: function (requestData, timeout) {
				return this.performRequest({
					requestData: requestData,
					successFn: function (data) {
						return data;
					},
					failureFn: function (data, status) {
						throw data && data.message ? data.message : i18n.msg('core.errors.title') + ': ' + status;
					}
				}, timeout);
			},

			notificationRoot: function() {
				return config.notificationRoot;
			},

			apiUrl: function(relative) {
				return config.apiRoot + 'api/' + relative;
			},

			downloadUrl: function(relative) {
				return config.apiRoot + 'download/' + relative;
			},

			oauthUrl: function(provider) {
				return config.apiRoot + 'oauth/begin/' + provider;
			}
		});
	}]);
});