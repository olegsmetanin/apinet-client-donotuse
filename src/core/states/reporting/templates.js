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
			$scope.validation.generalErrors = [error];
		};

		$scope.uploadOptions = {
			url: 'api/core/reporting/UploadTemplate',
			done: function(e, data) {
				$scope.handleAdd(data.result);
			},
			fail: function(e, data) {
				//if not canceled
				if (data.errorThrown !== 'abort') {
					handleException(data.result.message);
				}
			}
		};

		$scope.handleAdd = function(response) {
			if (response && response.files) {
				response.files.map(function(file) {
					$scope.models.push(file.model);
				});
			}
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