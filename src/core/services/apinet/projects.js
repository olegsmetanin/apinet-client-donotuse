angular.module('core')
	.service("projectsService", ['apinet', function ($apinet) {
		angular.extend(this, {
			getProjects: function (requestData) {
				return $apinet.getModels(angular.extend({
					modelType: 'AGO.Docstore.Model.Projects.ProjectModel'
				}, requestData));
			}
		});
	}]);