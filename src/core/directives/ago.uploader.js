define([
	'../moduleDef',
	'require',
	'jquery',
	'angular',
	'text!./ago.uploader.tpl.html',
	'text!./ago.uploader.inrow.tpl.html',
	'css!./ago.uploader.css'
], function (module, require, $, angular , tpl, tplInrow) {
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
		xhrFields: { withCredentials: true },
		maxChunkSize: 1024 * 1024 * 3//, //3Mb default
		//maxChunkSize: 1024//, testing chunking
	};

	//Prevent default browser behavior when file dropped on page (see blueimp doc for dropZone)
	//needs run only one per page
	$(document).bind('drop dragover', function (e) {
		e.preventDefault();
	});

	var applyHandlers = function(scope, $elm, $dropTarget) {
		scope.uploading = false;
		scope.progress = 0;
		$dropTarget = $dropTarget || $elm;

		scope.$on('fileuploadsubmit', function(e, data) {
			//must have for uploader!! if some files uploaded in parallel and chuncked
			data.formData = data.formData || {};
			angular.extend(data.formData, {uploadid: newUuid()});
			scope.uploading = true;
			scope.progress = 0;

			//BUG: Here is the bug, when we drop file to drop zone, class not removed
			//There are quick and dirty fix/hack for this
			//Needs to reimplement
			$dropTarget.removeClass('file-upload-dropzone_hover');
		});
		scope.$on('fileuploadprogressall', function (e, data) {
			var progress = parseInt(data.loaded / data.total * 100, 10);
			scope.progress = progress;
		});
		scope.$on('fileuploadalways', function(e, data) {
			scope.clear(data.files);
			var rejectedCnt = 0;
			scope.queue.map(function(file) {
				if (file.$state() === 'rejected') {
					rejectedCnt++;
				}
			});
			scope.uploading = scope.queue.length > rejectedCnt;
			if (scope.queue.length === rejectedCnt) {
				scope.clear(scope.queue);
			}
		});

		//reattach event handlers (from fileupload source - change specialAttributes)
		$elm.fileupload('option', { dropZone: $dropTarget, pasteZone: $dropTarget});

		$dropTarget.on('dragover', function(e) { $dropTarget.addClass('file-upload-dropzone_hover'); });
		$dropTarget.on('dragleave', function(e) { $dropTarget.removeClass('file-upload-dropzone_hover'); });
		scope.$on('destroy', function() {
			$dropTarget.off('dragenter dragover dragleave');
		});
	};

	module.directive('agoUploader', ['i18n', function(i18n) {
		return {
			restrict: 'EA',
			replace: true,
			template: tpl,
			scope: true,
			link: function(scope, elm, attrs) {
				applyHandlers(scope, $(elm[0]));
				
				scope.options = angular.extend(options, scope.$eval(attrs.agoUploader));
			}
		};
	}]);

	module.directive('agoUploaderInrow', ['i18n', '$timeout', function(i18n, $timeout) {
		return {
			restrict: 'EA',
			replace: true,
			template: tplInrow,
			scope: true,
			link: function($scope, elm, attrs) {
				$scope.loadingImgUrl = require.toUrl('core/themes/flatty/images/ajax-loaders/15.gif');

				$timeout(function(){
					//needs wait for ng-repeat rendering
					var $elm = $(elm[0]);
					var $dropTarget = $(attrs.dropTarget);
					applyHandlers($scope, $elm, $dropTarget);
				
					$scope.options = angular.extend(options, $scope.$eval(attrs.agoUploaderInrow));
				});
			}
		};
	}]);
});