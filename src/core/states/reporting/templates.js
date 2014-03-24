define([
	'../../moduleDef',
	'angular',
	'text!./templates.tpl.html',
	'../page'
], function (module, angular, template) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state({
			name: 'page.project.templates',
			abstract: true,
			views: {
				'': { template: template, controller: 'reportTemplatesController' }
			},
			resolve: {
				tabs: function() { return []; /*will be filled in child states*/ }
				//overriding resolve in custom data not working, only combination with resolve
				//in parent state plus onEnter in child state (see taskReportTemplates)
			},
			onExit: function($rootScope) {
				$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
			}
		});
	}])
	.controller('reportTemplatesController', 
		['$scope', 'apinetService', '$window', 'i18n', 'reportService', '$stateParams', 'tabs',
		function($scope, apinetService, $window, i18n, reportService, $stateParams, tabs) {

		$scope.tabs = tabs; //inheritors must add own tabs to collection

		var handleException = function(error) {
			$scope.resetValidation();
			$scope.validation.generalErrors = angular.isArray(error) ? error : [error];
		};

		$scope.uploadOptions = {
			url: reportService.templateUploadUrl(),
			done: function(e, data) {
				$scope.handleResult(data.result);
			},
			fail: function(e, data) {
				//if not canceled
				if (data.errorThrown !== 'abort') {
					handleException(data.result.message);
				}
			},
			submit: function(e, data) {
				angular.extend(data.formData, {project: $stateParams.project});
			}
		};

		$scope.itemUploadOptions = function(model) {
			var itemOptions = angular.copy($scope.uploadOptions);
			angular.extend(itemOptions, {
				maxNumberOfFiles: 1,
				submit: function(e, data) {
					angular.extend(data.formData, {project: $stateParams.project, templateId: model.Id});
				}
			});
			return itemOptions;
		};

		$scope.handleResult = function(response) {
			if (response && response.files) {
				response.files.map(function(file) {
					var idx = $scope.findIdexById(file.model.Id);
					if (idx < 0) {
						$scope.models.push(file.model);
					} else {
						angular.extend($scope.models[idx], file.model);
					}
				});
			}
		};

		$scope.findIdexById = function(templateId) {
			if (!templateId) {
				return -1;
			}
			var modelIndex = -1;
			angular.forEach($scope.models, function(model, index) {
				if (model.Id === templateId){
					modelIndex = index;
				}
			});
			return modelIndex;
		};

		$scope.delete = function(model) {
			if (!$window.confirm(i18n.msg('core.confirm.delete.records'))) {
				return;
			}

			apinetService.action({
				method: 'core/reporting/DeleteTemplate',
				project: $stateParams.project,
				templateId: model.Id})
			.then(function() {
				var index = $scope.models.indexOf(model);
				if (index >= 0) {
					$scope.models.splice(index, 1);
				}
			}, handleException);
		};

		$scope.downloadUrl = function(template) {
			return reportService.templateDownloadUrl(template.ProjectCode, template.Id);
		};

	}]);
});