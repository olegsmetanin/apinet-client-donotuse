define([
	'../../moduleDef',
	'text!./accessDenied.tpl.html',
	'../projects'
], function (module, tpl) {
	module.config(['$stateProvider', function($stateProvider) {
		$stateProvider.state({
			name: 'page.projects.accessDenied',
			url: '/projects/accessDenied',
			views: {
				'': { template: tpl },
				'moduleMenu@page': { template: '' }
			},
			controller: ['$scope', 'errorPageService', '$state', function($scope, errorPageService, $state){
				var err = errorPageService.getError();
				$scope.reason = err.reasonKey;
				$scope.reasonTitle = err.reasonTitleKey;
				
				$scope.hasBack = err.backState != null;
				$scope.goBack = function() {
					$state.go(err.backState, err.backStateParams);
				}
			}]
		});
	}]);
});
