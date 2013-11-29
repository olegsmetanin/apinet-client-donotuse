define(['angular', '../moduleDef'], function (angular, module) {
	module.service('metadataService', ['$http', function($http) {
		angular.extend(this, {
			metadata: { },

			reset: function() {
				this.metadata = { };
			},

			modelMetadata: function (method, modelType, callback) {
				if(!modelType || !callback) {
					return;
				}

				if(this.metadata[modelType]) {
					callback(this.metadata[modelType]);
					return;
				}

				var promise = this.promise ? this.promise : $http.post('/api/' + method, { });
				this.promise = promise;

				var me = this;
				promise.success(function (data) {
					angular.extend(me.metadata, data || { });
					me.modelMetadata(null, modelType, callback);
				})
				.error(function () {
					me.metadata = { };
				});
			}
		});
	}]);
});