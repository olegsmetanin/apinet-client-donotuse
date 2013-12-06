define(['../moduleDef'], function (module) {
	module.service('moduleConfig', ['$q', '$http', 'sysConfig',
		function ($q) {
			return {
				getRole: function () {
					return $q.when('admin');
					/*TODO продумать как это должно работать. Вызывается из userRoleCtrl
					return $http.post('/api/' + sysConfig.module + '/users/getRole', {
						project: project || sysConfig.project
					})
						.then(function (response) {
							return response.data || '';
						});*/
				}

			};
			return service;
		}
	]);
});