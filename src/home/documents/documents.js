angular.module('home')
	.config(['$routeProvider', '$locationProvider', '$stateProvider', '$urlRouterProvider', 'sysConfig',
		function ($routeProvider, $locationProvider, $stateProvider, $urlRouterProvider, sysConfig) {

			var documentsList = {
				name: 'page.documentList',
				url: '/documents/listview',
				views: {
					'content': {
						templateUrl: sysConfig.src('home/documents/listview/documentsList.tpl.html')
					}
				}
			};

			$stateProvider
				.state(documentsList);

		}
	])
	.service("documentsService", ['$q', '$http', 'sysConfig',
		function ($q, $http /*, sysConfig*/) {
			angular.extend(this, {
				getDocuments: function (requestData) {
					var deferred = $q.defer();
					$http.post("/api/models/",
						angular.extend({
							action: 'getModels'
						}, requestData), {
							tracker: 'documents'
						}
					)
					.success(function (data) {
						deferred.resolve(data);
					})
					.error(function (data, status, headers, config) {
						// TODO
					});
					return deferred.promise;
				}
			});
		}
	])
	.controller('documentsListCtrl', ['$scope', 'documentsService', 'pageConfig', 'sysConfig', 'promiseTracker', 'reportService',
		function ($scope, $documentsService, $pageConfig, sysConfig, promiseTracker, reportService) {
			angular.extend($scope, {
				documents: [],
				modelType: 'AGO.Docstore.Model.Documents.DocumentModel',
				structuredFilter: { },
				userFilter: { },
				applyEnabled: false,
				selectedDocumentId: null,
				documentDetailsTemplate: null,
				loading: promiseTracker('documents'),
				
				refreshList: function() {
					var filter ={
						op: '&&',
						items: [ ]
					};
					if($scope.structuredFilter.items && $scope.structuredFilter.items.length) {
						filter.items.push($scope.structuredFilter);
					}
					if($scope.userFilter.items && $scope.userFilter.items.length) {
						filter.items.push({
							path: 'CustomProperties',
							op: '&&',
							items: $scope.userFilter.items
						});
					}

					$documentsService.getDocuments({
						filter: filter,
						modelType: $scope.modelType
					}).then(function (result) {
						$scope.documents = [];
						if (result && angular.isArray(result.rows)) {
							$scope.documents = result.rows;
						}
						$scope.applyEnabled = false;
					});
				},
				
				generateReport: function () {
					reportService.generate({
						action: "generate",
						model: "Document",
						filter: {},
						name: "report" + new Date()
					});
				}
			});

			$pageConfig.setConfig({
				breadcrumbs: [{
					name: 'Documents',
					url: '/#!/documents/listview'
				}]
			});

			$scope.$watch('structuredFilter', function() {
				$scope.applyEnabled = true;
			}, true);

			$scope.$watch('userFilter', function() {
				$scope.applyEnabled = true;
			}, true);

			$scope.refreshList();
		}
	]);