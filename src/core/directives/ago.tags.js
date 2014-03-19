define([
	'../moduleDef',
	'jquery',
	'angular',
	'text!./ago.tags.tpl.html',
	'css!./ago.tags.css'
], function (module, $, angular, tpl) {
	module.directive('agoTags', ['apinetService', '$timeout', '$stateParams', 
		function(apinetService, $timeout, $stateParams) {
		return {
			restrict: 'EA',
			replace: true,
			scope: {
				viewModel: '=',
				onNewTag: '&',
				onCancelNewTag: '&',
				onTag: '&',
				onDetag: '&',
				onError: '&'
			},
			template: function(elm, attrs) {
				return tpl.replace('$$lookupUrl$$', attrs.lookupMethod);
			},
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				//in link function interpolation extract empty value, move i18n assigment here
				$scope.i18n = $rootScope.i18n;
			}],
			link: function($scope, elm, attrs) {
				$scope.nullOption = {text: ''};

				//don't touch model there - will be 'digest already in progress' error
				// if ($scope.viewModel) {
				// 	$scope.viewModel.newTagMode = false;
				// 	$scope.viewModel.newTagModel = $scope.nullOption;
				// }

				$scope.handleError = function(error) {
					if (angular.isFunction($scope.onError)) {
						$scope.onError({error: error});
					} else {
						throw error;
					}
				}

				$scope.newTag = function (viewModel) {
					if(!viewModel) {
						return;
					}

					viewModel.newTagMode = true;
					viewModel.newTagModel = $scope.nullOption;//using null trigger select2.clear() and change event
					//and than get '$digest already in progress' exception. Can't find any other solution
					//Trying $timeout and various changes in ago.select2 - this hack only working for me

					if (angular.isFunction($scope.onNewTag)) {
						$scope.onNewTag()
					}
				};

				$scope.cancelNewTag = function (viewModel) {
					if(!viewModel) {
						return;
					}

					viewModel.newTagMode = false;
					viewModel.newTagModel = $scope.nullOption; //see comment above

					if (angular.isFunction($scope.onCancelNewTag)) {
						$scope.onCancelNewTag();
					}
				};

				$scope.tag = function (viewModel) {
					if(!viewModel || !viewModel.newTagModel || !viewModel.newTagModel.id) {
						return;
					}

					for (var i = 0; i < viewModel.Tags.length; i++) {
						if (viewModel.Tags[i].id === viewModel.newTagModel.id) {
							return;
						}
					}

					viewModel.newTagMode = false;

					apinetService.action({
						method: attrs.tagMethod,
						project: $stateParams.project,
						modelId: viewModel.Id,
						tagId: viewModel.newTagModel.id
					}).then(function (result) {
						if (result) {
							viewModel.Tags.push(angular.extend({ }, viewModel.newTagModel));

							if (angular.isFunction($scope.onTag)) {
								$scope.onTag({result: result});
							}
						}
					}, $scope.handleError);
				};

				$scope.detag = function (viewModel, tag) {
					if (!viewModel || !viewModel.Id || !viewModel.Tags || !tag) {
						return;
					}

					apinetService.action({
						method: attrs.detagMethod,
						project: $stateParams.project,
						modelId: viewModel.Id,
						tagId: tag.id
					}).then(function (result) {
						if (result) {
							for (var i = 0; i < viewModel.Tags.length; i++) {
								if (viewModel.Tags[i] === tag) {
									viewModel.Tags.splice(i, 1);
									break;
								}
							}

							if (angular.isFunction($scope.onDetag)) {
								$scope.onDetag({result: result});
							}
						}
					}, $scope.handleError);
				};
			}
		}
	}]);
});
