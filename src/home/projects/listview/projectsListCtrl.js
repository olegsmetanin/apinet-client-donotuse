angular.module('home')
	.controller('projectsListCtrl', ['$scope', 'pageConfig', 'promiseTracker', 'security',
		function($scope, $pageConfig, promiseTracker, security) {
			$pageConfig.setConfig({
				breadcrumbs: [{
					name: 'Projects',
					url: '/#!/projects/listview'
				}]
			});

			angular.extend($scope, {
				loading: promiseTracker('projects'),
				createProjectEnabled: security.isAdmin()
			});

			$scope.$watch('createProjectEnabled', function(value) {
				console.log('createProjectEnabled', value);
			}, true);
		}
	]);