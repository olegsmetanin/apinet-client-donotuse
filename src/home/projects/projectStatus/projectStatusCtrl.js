angular.module('home')
	.controller('projectStatusCtrl', ['$scope', 'pageConfig', 'sysConfig', 'promiseTracker', 'reportService',
		function($scope, $pageConfig, sysConfig, promiseTracker, reportService) {

			$pageConfig.setConfig({
				breadcrumbs: [{
					name: 'Projects statuses',
					url: '/#!/projectStatus'
				}]
			});

		}
	])
	.controller('projectStatusTabsCtrl', ['$scope', 'pageConfig', 'sysConfig', 'promiseTracker', 'reportService',
		function($scope, $pageConfig, sysConfig, promiseTracker, reportService) {

			$scope.tabs = [{
				Name: 'Common',
				Url: '#!/contracts/common'
			}, {
				Name: 'Tasks',
				Url: '#!/contracts/tasks'
			}];

		}
	]);