define(['module', '../moduleDef', 'angular'], function (requireModule, module, angular) {

	var config = requireModule.config() || { };
	config.apiRoot = config.apiRoot ? config.apiRoot : '/api/';
	config.downloadRoot = config.downloadRoot ? config.downloadRoot : '/download/';

	module.service('reportService', ['$rootScope', '$timeout', '$cacheFactory', '$q', 'apinetService',
		function($rootScope, $timeout, $cacheFactory, $q, apinetService) {
			angular.extend(this, {
				cache: $cacheFactory('userReports'),

				fireChanged: function() {
					$rootScope.$emit('reports:changed');
				},

				getServices: function() {
					var that = this,
						services = that.cache.get('services');
					if (services && services.length > 0) {
						return $q.when(services);
					}

					return apinetService.action({method: 'core/reporting/getServices'})
						.then(function(response) {
							that.cache.put('services', response);
							return response;
						});
				},

				getReportSettings: function(types) {
					types = types || [];
					var that = this, settings = that.cache.get('settings.' + types.toString());

					if (settings && settings.length > 0) {
						return $q.when(settings);
					}
					return apinetService.action({
						method: 'core/reporting/getSettings',
						types: types}).then(function(response) {
							that.cache.put('settings.' + types.toString(), response);
							return response;
						});
				},

				runReport: function(parameters) {
					angular.extend(parameters, { method: 'core/reporting/runReport' });
					return apinetService.action(parameters)
						.then(function(response) {
							$rootScope.$emit('reports:newReport', {report: response});
						});
				},

				getTopLastReports: function() {
					return apinetService.action({ method: 'core/reporting/getTopLastReports' });
				},

				cancelReport: function(id) {
					return apinetService.action({
						method: 'core/reporting/cancelReport',
						id: id
					}).then(this.fireChanged);
				},

				deleteReport: function(id) {
					return apinetService.action({
						method: 'core/reporting/deleteReport',
						id: id
					}).then(this.fireChanged);
				},

				templateUploadUrl: function() {
					return config.apiRoot + 'core/reporting/UploadTemplate';
				},

				templateDownloadUrl: function(id) {
					return config.downloadRoot + 'report-template/' + id;
				},

				reportDownloadUrl: function(id) {
					return config.downloadRoot + 'report/' + id;
				}
			});
		}
	]);
});