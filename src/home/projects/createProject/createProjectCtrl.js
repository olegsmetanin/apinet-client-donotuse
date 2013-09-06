angular.module('home')
	.controller('createProjectCtrl', ['$scope', '$location', 'pageConfig', 'dictionaryService', 'apinetService',
		function($scope, $location, $pageConfig, $dictionaryService, $apinetService) {

			$pageConfig.setConfig({
				breadcrumbs: [{
					name: 'New project',
					url: '/#!/projects/createProject'
				}]
			});

			angular.extend($scope, {
				project: {},

				lookups: {
					projectType: null
				},

				validation: {
					generalError: null,
					fieldErrors: {}
				},

				projectTypeSelectOptions: {
					query: function (query) {
						$scope.$apply(function() {
							$dictionaryService.lookupModels({
								method: 'home/dictionary/getProjectTypes',
								filterProps: ['Name'],
								sortProps : ['Name'],
								term: query.term,
								page: query.page - 1
							})
							.then(function (result) {
								var processed = [];

								for(var i = 0; i < result.rows.length; i++) {
									processed.push({
										id: result.rows[i].Id,
										text: result.rows[i].Name
									});
								}

								query.callback({
									results: processed,
									more: result.rows.length === $dictionaryService.pageSize
								});
							}, function(error) {
								query.callback({
									results: [ { id: '', text: error } ],
									more: false
								});
							});
						});
					}
				},

				createProject: function() {
					$apinetService.action({
						method: 'home/projects/createProject',
						project: $scope.project
					})
					.then(function(result) {
						if(result.success) {
							$location.path('/projects/listview');
						}
						else {
							angular.extend($scope.validation, result);
						}
					}, function(error) {
						//TODO: Global message box
						console.log(error);
					});
				}
			});

			$scope.$watch('lookups.projectType', function(value) {
				if(value && value.id) {
					$scope.project.Type = value.id;
				}
			}, true);
		}
	]);