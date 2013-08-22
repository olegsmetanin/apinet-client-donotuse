angular.module('core')
	.service('metadataService', ['$http', function($http) {
		angular.extend(this, {
			modelMetadata: function (modelType, callback) {
				if(this.metadata) {
					callback(this.metadata[modelType] ? this.metadata[modelType] : { });
					return;
				}

				var promise = this.promise ? this.promise : $http.post('/metadata/AllModelsMetadata/', { });
				this.promise = promise;

				var me = this;
				promise.success(function (data) {
					me.metadata = data ? data : { };
					me.modelMetadata(modelType, callback);
				})
				.error(function () {
					me.metadata = { };
					me.modelMetadata(modelType, callback);
				});
			}
		});
	}]);