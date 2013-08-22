angular.module('core')
	.service('documentsService', ['apinetService', function ($apinetService) {
		angular.extend(this, {
			getDocuments: function (requestData) {
				return $apinetService.getModels(angular.extend({
					modelType: 'AGO.Docstore.Model.Documents.DocumentModel'
				}, requestData));
			}
		});
	}]);