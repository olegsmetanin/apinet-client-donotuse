﻿angular.module('home')
	.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig',
		function($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig) {

			var projectsList = {
				name: 'page.projectList',
				url: '/projects/listview',
				views: {
					'content': {
						templateUrl: sysConfig.src('home/projects/listview/projectsList.tpl.html')
					}
				}
			},
				projectsStatus = {
					name: 'page.projectStatus',
					url: '/projectStatus',
					views: {
						'content': {
							templateUrl: sysConfig.src('home/projects/projectStatus/projectStatus.tpl.html')
						}
					}
				};

			$stateProvider
				.state(projectsList)
				.state(projectsStatus);

		}
	])
	.controller('projectsListCtrl', ['$scope', 'projectsService', 'pageConfig', 'sysConfig', 'promiseTracker', 'reportService',
		function($scope, $projectsService, $pageConfig, sysConfig, promiseTracker, reportService) {
			angular.extend($scope, {
				projects: [],
				structuredFilter: {},
				applyEnabled: false,
				selectedProjectId: null,
				projectDetailsTemplate: null,
				loading: promiseTracker('projects'),

				refreshList: function() {
					var filter = {
						op: '&&',
						items: []
					};
					if ($scope.structuredFilter.items && $scope.structuredFilter.items.length) {
						filter.items.push($scope.structuredFilter);
					}

					$projectsService.getProjects({
						filter: filter
					})
						.then(function(result) {
							$scope.projects = result.rows;
							$scope.applyEnabled = false;
						});
				},

				generateReport: function() {
					reportService.generate({
						action: "generate",
						model: "Project",
						filter: {},
						name: "report" + new Date()
					});
				},

				showDetails: function(projectId) {
					$scope.selectedProjectId = projectId;
					$scope.projectDetailsTemplate = projectId && projectId.indexOf('play') >= 0 ?
						sysConfig.src('home/projects/listview/details/playProjectDetails.tpl.html') :
						sysConfig.src('home/projects/listview/details/otherProjectDetails.tpl.html');
				}
			});

			$pageConfig.setConfig({
				breadcrumbs: [{
					name: 'Projects',
					url: '/#!/projects/listview'
				}]
			});

			$scope.$watch('structuredFilter', function() {
				$scope.applyEnabled = true;
			}, true);

			$scope.refreshList();
		}
	]);