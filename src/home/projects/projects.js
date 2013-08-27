angular.module('home')
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
			$pageConfig.setConfig({
				breadcrumbs: [{
					name: 'Projects',
					url: '/#!/projects/listview'
				}]
			});

			angular.extend($scope, {
				projects: [],
				filter: {
					complex: {}
				},
				applyEnabled: false,
				selectedProjectId: null,
				projectDetailsTemplate: null,
				loading: promiseTracker('projects'),

				refreshList: function() {
					$projectsService.getProjects({
						filter: $scope.filter
					})
					.then(function(result) {
						$scope.projects = result.rows;
						$scope.applyEnabled = false;
					});
				},

				showDetails: function(projectId) {
					$scope.selectedProjectId = projectId;
					$scope.projectDetailsTemplate = projectId && projectId.indexOf('play') >= 0 ?
						sysConfig.src('home/projects/listview/details/playProjectDetails.tpl.html') :
						sysConfig.src('home/projects/listview/details/otherProjectDetails.tpl.html');
				}
			});

			$scope.$watch('filter', function() {
				$scope.applyEnabled = true;
			}, true);

			$scope.refreshList();
		}
	]);