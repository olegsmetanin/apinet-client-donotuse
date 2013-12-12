define([
	'../../moduleDef',
	'angular',
	'text!./templates.tpl.html',
	'../page',
	'blueimp-fileupload'
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

		$scope.uploadOptions = {
			url: 'api/core/reporting/UploadTemplate',
			autoUpload: true,
			maxChunkSize: 1024 * 1024 * 5, //5Mb default
			//maxChunkSize: 1024, testing chunking
			submit: function(e, data) {
				//must have for uploader!! if some files uploaded in parallel and chuncked
				data.formData = { uploadid: $scope.uuid() }
			},
			done: function(e, data) {
				$scope.handleAdd(data.result);
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

			console.log('TODO: implement model deletion (%s)', model.Name);
		};

		//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
		//https://github.com/Widen/fine-uploader/blob/master/client/js/util.js#L443
		$scope.uuid = function(){
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
				/*jslint eqeq: true, bitwise: true*/
				var r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
				return v.toString(16);
			});
    	};

	}]);
});