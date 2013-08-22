angular.module('home')
	.controller('projectStatusCtrl', ['$scope', 'projectsService', 'pageConfig', 'sysConfig', 'promiseTracker', 'reportService',
		function($scope, $projectsService, $pageConfig, sysConfig, promiseTracker, reportService) {

			$pageConfig.setConfig({
				breadcrumbs: [{
					name: 'Projects statuses',
					url: '/#!/projectStatus'
				}]
			});

		}
	])
	.controller('projectStatusTabsCtrl', ['$scope', 'projectsService', 'pageConfig', 'sysConfig', 'promiseTracker', 'reportService',
		function($scope, $projectsService, $pageConfig, sysConfig, promiseTracker, reportService) {

			$scope.tabs = [{
				Name: 'Common',
				Url: '#!/contracts/common'
			}, {
				Name: 'Tasks',
				Url: '#!/contracts/tasks'
			}];

		}
	])


	;