define([
	'../moduleDef',
	'jquery',
	'angular',
	'text!./ago.uploader.tpl.html',
	'css!./ago.uploader.css'/*,
	'blueimp-fileupload'*/
], function (module, $, angular , tpl) {
	module.directive('agoUploader', ['$stateParams', 'apinetService', 'i18n', function($stateParams, apinetService, i18n) {

		//http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
		//https://github.com/Widen/fine-uploader/blob/master/client/js/util.js#L443
		var newUuid = function(){
			return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
				/*jslint eqeq: true, bitwise: true*/
				var r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
				return v.toString(16);
			});
    	};

    	var options = {
			autoUpload: true,
			maxChunkSize: 1024 * 1024 * 5//, //5Mb default
			//maxChunkSize: 1024//, testing chunking
			
		};

		return {
			restrict: 'EA',
			replace: true,
			template: tpl,
			scope: true,
			link: function(scope, elm, attrs) {
				scope.uploading = false;
				scope.progress = 0;

				angular.extend(options, {
					//autoUpload: false,
					submit: function(e, data) {
						//must have for uploader!! if some files uploaded in parallel and chuncked
						data.formData = { uploadid: newUuid() };
						scope.uploading = true;
						scope.progress = 0;
					},
					progressall: function (e, data) {
						var progress = parseInt(data.loaded / data.total * 100, 10);
						scope.progress = progress;
					},
					always: function(e, data) {
						scope.clear(data.files);
						scope.uploading = scope.queue.length > 0;
					}
				});
				
				scope.options = angular.extend(options, scope.$eval(attrs.agoUploader));
			}
		};
	}]);
});