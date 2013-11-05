define(['angular', '../moduleDef'], function (angular, module) {
	module.service('reportService', ['$rootScope', '$timeout', '$http', '$cacheFactory', '$q',
		function($rootScope, $timeout, $http, $cacheFactory, $q) {
			angular.extend(this, {
				reports: {
					gen: [],
					done: []
				},
				cache: $cacheFactory('userReports'),

				getReports: function() {
					var that = this;
					return that.reports;
				},

				getUnreadUserReports: function() {
					var that = this,
						chVal = that.cache.get('unreadUserReports');
					if (!chVal) {
						that.updateUnreadUserReports();
					}
					return chVal || [];
				},

				updateUnreadUserReports: function() {
					//TODO: Вернуть потом
					/*var that = this;

					$http.post('/api/v1', {
						action: 'getUnreadUserReports'
					}).then(function(response) {
						that.cache.put('unreadUserReports', response.data);
						$rootScope.$broadcast('events:unreadReportsChanged');
					});*/
				},


				setReports: function(new_reports) {
					var that = this;
					that.cache.put('unreadUserReports', new_reports);
					$rootScope.$broadcast('events:unreadReportsChanged');
				},

				generateReport: function(params) {
					$http.post('/api/v1', params);
				},

				reloadReports: function() {
					var that = this;

					$http.post('/api/v1', {
						action: 'generateStatus',
						model: 'Generator'
					}).then(function(response) {
						that.reports = response.data.reports;
						$rootScope.$broadcast('events:reportsChanged');
					});
				},

				cancelReportGeneration: function(name) {
					var that = this;
					that.reports.gen = [];
					$rootScope.$broadcast('events:reportsChanged');
					// ajax request
				}


			});
		}
	]);
});