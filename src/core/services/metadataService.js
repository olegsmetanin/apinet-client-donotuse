define(['angular', '../moduleDef'], function (angular, module) {
	module.service('metadataService', ['$http', function($http) {
		angular.extend(this, {
			metadata: null,

			modelMetadata: function (method, modelType, callback) {
				if(!callback) {
					return;
				}

				if(angular.isObject(this.metadata)) {
					if(modelType) {
						if(this.metadata[modelType]) {
							callback(this.metadata[modelType]);
							return;
						}
					}
					else {
						for(var key in this.metadata) {
							if(!this.metadata.hasOwnProperty(key)) {
								continue;
							}
							callback(this.metadata[key]);
						}
						return;
					}
				}

				var promise = this.promise ? this.promise : $http.post('/api/' + method, { });
				this.promise = promise;

				var me = this;
				promise.success(function (data) {
					me.metadata = me.metadata || { };
					angular.extend(me.metadata, data);
					me.modelMetadata(null, modelType, callback);
				})
				.error(function () {
					me.metadata = null;
				});
			}
		});
	}]);
});