define([
	'../../moduleDef',
	'angular',
	'text!./templates.tpl.html',
	'../page'
], function (module, angular, template) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state({
			name: 'page.reporting.templates',
			url: '/projects/reporting/templates',
			onEnter: function(pageConfig, i18n) {
				pageConfig.setConfig({
					breadcrumbs: [{
						name: i18n.msg('core.reporting.templates.title'),
						url: 'page.reporting.templates'
					}]
				});
			},
			template: template
		});
	}])
	.controller('reportTemplatesController', 
		['$scope', 'apinetService', '$window', 'i18n',
		function($scope, apinetService, $window, i18n) {

		var handleException = function(error) {
			$scope.resetValidation();
			$scope.validation.generalErrors = angular.isArray(error) ? error : [error];
		};

		$scope.uploadOptions = {
			url: 'api/core/reporting/UploadTemplate',
			done: function(e, data) {
				$scope.handleResult(data.result);
			},
			fail: function(e, data) {
				//if not canceled
				if (data.errorThrown !== 'abort') {
					handleException(data.result.message);
				}
			}
		};

		$scope.itemUploadOptions = function(model) {
			var itemOptions = angular.copy($scope.uploadOptions);
			angular.extend(itemOptions, {
				submit: function(e, data) {
					angular.extend(data.formData, {templateId: model.Id});
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
			if (!templateId) return -1;
			var modelIndex = -1;
			angular.forEach($scope.models, function(model, index) {
				if (model.Id === templateId){
					modelIndex = index;
					return;
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
				templateId: model.Id})
			.then(function() {
				var index = $scope.models.indexOf(model);
				if (index >= 0) {
					$scope.models.splice(index, 1);
				}
			}, handleException);
		};
	}]);
});