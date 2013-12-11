define(['../moduleDef', 'angular'], function (module, angular) {
	module.service('metadataService', ['apinetService', function(apinetService) {
		angular.extend(this, {
			metadata: null,
			promise: null,

			modelMetadata: function (method, modelType, callback) {
				if(!callback) {
					return;
				}

				if(modelType && angular.isObject(this.metadata) && this.metadata[modelType]) {
					callback(this.metadata[modelType]);
					return;
				}

				var promise = this.promise ? this.promise : apinetService.action({ method: method });
				this.promise = promise;

				var me = this;
				promise.then(function (data) {
					me.metadata = angular.extend({ }, data);
					me.promise = null;

					if(modelType) {
						if(me.metadata[modelType]) {
							callback(me.metadata[modelType]);
						}
						return;
					}

					for(var key in me.metadata) {
						if(!me.metadata.hasOwnProperty(key)) {
							continue;
						}
						callback(me.metadata[key]);
						return;
					}
				}, function () {
					me.metadata = null;
					me.promise = null;
				});
			}
		});
	}]);
});