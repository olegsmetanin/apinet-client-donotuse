angular.module('tasks')
	.config(['$stateProvider', 'sysConfig', 'securityAuthorizationProvider',
		function ($stateProvider, sysConfig, securityAuthorizationProvider) {

			var types = {
				name: 'page.types',
				url: '/dictionary/types',
				views: {
					'content': {
						templateUrl: sysConfig.src('tasks/task-type/taskTypeList.tpl.html'),
						controller: 'taskTypeCtrl'
					}
				},
				resolve: {
					pageConfig: 'pageConfig',
					promiseTracker: 'promiseTracker',
					authUser: securityAuthorizationProvider.requireAuthenticatedUser()
				},
				onEnter: function(pageConfig) {
					pageConfig.setConfig({
						breadcrumbs: [
							{ name: 'Tasks', url: '#!/' },
							{ name: 'Tasks types', url: '#!/dictionary/types' }]
					});
				}
			};

			$stateProvider.state(types);
		}
	])
	.controller('taskTypeCtrl', ['$scope', 'promiseTracker', 'sysConfig', 'apinetService', 
		function($scope, promiseTracker, sysConfig, apinetService) {

			// angular.extend($scope, {
			// 	loading: promiseTracker('projects'),
			// 	requestParams: { project: sysConfig.project },
			// 	gridOptions: {
			// 		totalRowsCount: 10,
			// 		pageSize: 10,
			// 		page: 1,
			// 		numPages: 1
			// 	},
			// 	newName: '',
			// 	validation: {
			// 		generalError: null,
			// 		fieldErrors: {}
			// 	},
			// 	createTaskType: function() {
			// 		var model = {
			// 			id: null,
			// 			name: $scope.newName
			// 		};
			// 		apinetService.action({
			// 			method: 'tasks/dictionary/editTaskType',
			// 			project: $sysConfig.project,
			// 			model: model})
			// 		.then(function(result) {
			// 			if(result.success) {
			// 				$scope.newName = null;
			// 				$scope.refreshList();
			// 			} else {
			// 				angular.extend($scope.validation, result);
			// 			}
			// 		}, function(error) {
			// 			console.log(error);
			// 		});
			// 	}
			// });


			$scope.loading = promiseTracker('projects');
			$scope.requestParams = { project: sysConfig.project };
			$scope.gridOptions = {
				totalRowsCount: 10,
				pageSize: 10,
				page: 1,
				numPages: 1
			};

			$scope.newName = '';
			$scope.validation = {
				generalError: null,
				fieldErrors: {}
			};

			$scope.createTaskType = function() {
				var model = {
					id: null,
					name: $scope.newName
				};
				apinetService.action({
					method: 'tasks/dictionary/editTaskType',
					project: $sysConfig.project,
					model: model})
				.then(function(result) {
					if(result.success) {
						$scope.newName = null;
						$scope.refreshList();
					} else {
						angular.extend($scope.validation, result);
					}
				}, function(error) {
					console.log(error);
				});
			};
	}]);