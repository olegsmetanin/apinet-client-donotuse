define([
	'../../moduleDef',
	'angular',
	'text!./tagsList.tpl.html',
	'css!./tagsList.css'
], function (module, angular, tpl) {
	module.directive('tagsList', [function() {
		return {
			restrict: 'E',
			replace: true,
			template: tpl,
			scope: {
				tags: '=',
				parentId: '@',
				loadTags: '&',
				createTag: '&',
				updateTag: '&',
				deleteTag: '&'
			},
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				$scope.newTag = function() {
					$scope.tags = $scope.tags || [];

					for(var i = 0; i < $scope.tags.length; i++) {
						if($scope.tags[i] && !$scope.tags[i].Id) {
							return;
						}
					}
					
					$scope.tags.unshift({ parentId: $scope.parentId, Name: $rootScope.i18n.core.tags.newTag });
				};
			}]
		};
	}]);
});