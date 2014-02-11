define([
	'../moduleDef',
	'angular',
	'text!./taskProjectMembers.tpl.html'//,'css!./executorsView.css'
], function (module, angular, tpl) {
	module.directive('taskProjectMembers', function() {
		return {
			restrict: 'EA',
			replace: true,
			template: tpl,
			scope: {
				projectId: '=',
				onError: '&'
			},
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				$scope.i18n = $rootScope.i18n;
			}],
			link: function(scope, elm, attrs) {
				scope.collapsed = false;//TODO change to true after implementation

				scope.editables = {
					newMember: null,
					isAdmin: false,
					isManager: false,
					isExecutor: false
				};

				scope.isMembersEditable = function() {
					return true;//TODO implement
				}
			}
		};
	});
});