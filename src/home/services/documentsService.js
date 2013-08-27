angular.module('core')
	.service('documentsService', ['apinetService', function ($apinetService) {
		angular.extend(this, {
			getDocuments: function (requestData) {
				return $apinetService.getModels(angular.extend({
					method: 'core/documents/getDocuments'
				}, requestData));
			}
		});
	}]);