angular.module('core')
	.service('projectsService', ['apinetService', function ($apinetService) {
		angular.extend(this, {
			getProjects: function (requestData) {
				return $apinetService.getModels(angular.extend({
					modelType: 'AGO.Docstore.Model.Projects.ProjectModel'
				}, requestData));
			}
		});
	}]);