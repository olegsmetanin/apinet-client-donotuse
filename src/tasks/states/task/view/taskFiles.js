define([
	'../../../moduleDef',
	'angular',
	'text!./taskFiles.tpl.html',
	'text!../../moduleMenu.tpl.html'
], function (module, angular, tpl, moduleMenuTpl) {

module
.state({
	name: 'page.project.taskFiles',
	url: '/tasks/:num/files',
	views: {
		'': { template: tpl },
		'moduleMenu@page': { template: moduleMenuTpl }
	},
	onEnter: function($rootScope, $stateParams) {
		$rootScope.breadcrumbs.push({
			name: 'tasks.list.title',
			url: 'page.project.tasks'
		});

		$rootScope.breadcrumbs.push({
			name: $stateParams.num,
			url: 'page.project.taskFiles'
		});
	},
	onExit: function($rootScope) {
		$rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 2, 2);
	}
})
.controller('taskFilesCtrl', ['$scope', '$stateParams', 'apinetService', '$window', 'i18n', 'taskTabs',
	function($scope, $stateParams, apinetService, $window, i18n, taskTabs) {

		$scope.numpp = $stateParams.num;
		$scope.tabs = taskTabs.build($stateParams.num);

		$scope.$on('resetFilter', function () {
			$scope.requestParams.ownerId = $scope.numpp;
		});

		$scope.resetValidation = function() {
			if (!$scope.validation) {
				$scope.validation = {};
			}
			$scope.validation.generalErrors = [];
			$scope.validation.fieldErrors = {};
		};

		var handleException = function(error) {
			$scope.resetValidation();
			$scope.validation.generalErrors = angular.isArray(error) ? error : [error];
		};

		var uploadOptions = {
			url: apinetService.apiUrl('tasks/tasks/uploadFiles'),
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

		$scope.topUploadOption = function() {
			var topOptions = angular.copy(uploadOptions);
			angular.extend(topOptions, {
				submit: function(e, data) {
					angular.extend(data.formData, {
						project: $stateParams.project,
						ownerId: $scope.numpp
					});
				}
			});
			return topOptions;
		};

		$scope.itemUploadOption = function(file) {
			var itemOptions = angular.copy(uploadOptions);
			angular.extend(itemOptions, {
				maxNumberOfFiles: 1,
				submit: function(e, data) {
					angular.extend(data.formData, {
						project: $stateParams.project,
						ownerId: $scope.numpp,
						fileId: file.Id
					});
				}
			});
			return itemOptions;
		};

		$scope.findIdexById = function(fileId) {
			if (!fileId) {
				return -1;
			}
			var modelIndex = -1;
			angular.forEach($scope.models, function(model, index) {
				if (model.Id === fileId){
					modelIndex = index;
				}
			});
			return modelIndex;
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

		$scope.removeFromModels = function(modelsToRemove) {
			for(var i = 0; i < modelsToRemove.length; i++) {
				var index = $scope.models.indexOf(modelsToRemove[i]);
				if (index < 0) {
					continue;
				}
				$scope.models.splice(index, 1);
			}
		};

		$scope.hasSelected = function() {
			for(var i = 0; i < $scope.models.length; i++) {
				if ($scope.models[i].selected && $scope.models[i].selected === true) {
					return true;
				}
			}

			return false;
		};

		$scope.deleteSelected = function() {
			if (!$window.confirm(i18n.msg('core.confirm.delete.records'))) {
				return;
			}

			var ids = [];
			var modelsToRemove = [];
			for(var i = 0; i < $scope.models.length; i++) {
				if ($scope.models[i].selected && $scope.models[i].selected === true) {
					ids.push($scope.models[i].Id);
					modelsToRemove.push($scope.models[i]);
				}
			}
			if (ids.length <= 0) {
				return;
			}

			$scope.resetValidation();

			apinetService.action({
				method: 'tasks/tasks/deleteFiles',
				project: $stateParams.project,
				ids: ids })
			.then(function() {
				$scope.removeFromModels(modelsToRemove);
			}, handleException);
		};

		$scope.delete = function(model) {
			if (!model) {
				return;
			}
			if (!$window.confirm(i18n.msg('core.confirm.delete.record'))) {
				return;
			}

			apinetService.action({
				method: 'tasks/tasks/deleteFile',
				project: $stateParams.project,
				fileId: model.Id })
			.then(function() {
				$scope.removeFromModels([model]);
			}, handleException);
		};

		$scope.downloadUrl = function(file) {
			return apinetService.downloadUrl('file/' + $stateParams.project + '/' + file.Id);
		};

		$scope.resetValidation();
	}]);
});
