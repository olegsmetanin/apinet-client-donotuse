angular.module('core')
	.service('metadataService', ['$http', function($http) {
		angular.extend(this, {
			metadata: {},

			modelMetadata: function (method, modelType, callback) {
				if(this.metadata[method]) {
					if(modelType) {
						callback(this.metadata[method][modelType] ? this.metadata[method][modelType] : { });
					}
					else {
						for(var key in this.metadata[method]) {
							if(this.metadata[method].hasOwnProperty(key)) {
								callback(this.metadata[method][key] ? this.metadata[method][key] : { });
								break;
							}
						}
					}
					return;
				}

				var promise = this.promise ? this.promise : $http.post('/api/' + method, { });
				this.promise = promise;

				var me = this;
				promise.success(function (data) {
					me.metadata[method] = data ? data : { };
					me.modelMetadata(method, modelType, callback);
				})
				.error(function () {
					me.metadata[method] = { };
					me.modelMetadata(method, modelType, callback);
				});
			}
		});
	}]);