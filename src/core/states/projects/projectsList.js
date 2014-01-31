define([
	'../../moduleDef',
	'angular',
	'text!./projectsList.tpl.html',
	'jquery',
	'../projects',
	'css!./projectsList.css'
], function (module, angular, tpl, $) {
	module.config(['$stateProvider', function ($stateProvider) {
			$stateProvider.state({
				name: 'page.projects.projectsList',
				url: '/projects/listview',
				onEnter: function (pageConfig, i18n) {
					pageConfig.setConfig({
						breadcrumbs: [
							{
								name: i18n.msg('projects.list.title'),
								url: 'page.projects.projectsList'
							}
						]
					});
				},
				template: tpl
			});
		}])
		.controller('projectsListCtrl', ['$scope', '$timeout', 'apinetService', function ($scope, $timeout, apinetService) {
			$scope.doLayout = function() {
				$('.projectsWall').masonry();
			};

			$scope.newTag = function (viewModel) {
				if(!viewModel) {
					return;
				}

				viewModel.newTagMode = true;
				viewModel.newTagModel = null;

				$timeout($scope.doLayout);
			};

			$scope.cancelNewTag = function (viewModel) {
				if(!viewModel) {
					return;
				}

				viewModel.newTagMode = false;
				viewModel.newTagModel = null;

				$timeout($scope.doLayout);
			};

			$scope.newTagSelected = function (viewModel) {
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
					method: 'core/projects/tagProject',
					projectId: viewModel.Model.Id,
					tagId: viewModel.newTagModel.id
				}).then(function (result) {
					if (result) {
						viewModel.Tags.push(angular.extend({ }, viewModel.newTagModel));

						$timeout($scope.doLayout);
					}
				});
			};

			$scope.detag = function (viewModel, tag) {
				if (!viewModel || !viewModel.Model || !viewModel.Tags || !tag) {
					return;
				}

				apinetService.action({
					method: 'core/projects/detagProject',
					projectId: viewModel.Model.Id,
					tagId: tag.id
				}).then(function (result) {
					if (result) {
						for (var i = 0; i < viewModel.Tags.length; i++) {
							if (viewModel.Tags[i] === tag) {
								viewModel.Tags.splice(i, 1);
								break;
							}
						}

						$timeout($scope.doLayout);
					}
				});
			};

			$scope.$on('resetFilter', function () {
				$scope.filter.simple = { Participation: 'All' };
				$scope.requestParams.mode = 'All';
			});

			$scope.$watch('filter.simple.Participation', function (value) {
				$scope.requestParams.mode = value || 'All';
			}, true);
		}]);
});