define([
    '../../../moduleDef',
    'angular',
    'text!./taskComments.tpl.html',
    'text!../../moduleMenu.tpl.html'
], function (module, angular, tpl, moduleMenuTpl) {

    module.state({
        name: 'page.project.taskComments',
        url: '/tasks/:num/comments',
        views: {
            '': { template: tpl },
            'moduleMenu@page': { template: moduleMenuTpl }
        },
        onEnter: function($rootScope) {
            $rootScope.breadcrumbs.push({
                name: 'tasks.list.title',
                url: 'page.project.tasks'
            });
        },
        onExit: function($rootScope) {
            $rootScope.breadcrumbs.splice($rootScope.breadcrumbs.length - 1, 1);
        }
    })
    .controller('taskCommentsCtrl', ['$scope', 'apinetService', '$stateParams', 'taskTabs', function($scope, apinetService, $stateParams, taskTabs) {
        $scope.numpp = $stateParams.num;
        $scope.newComment = null;
        $scope.tabs = taskTabs.build($stateParams.num);

        var handleException = function(error) {
            $scope.resetValidation();
            $scope.validation.generalErrors = angular.isArray(error) ? error : [error];
        };

        $scope.$on('resetFilter', function () {
            $scope.requestParams.numpp = $scope.numpp;
        });

        $scope.addComment = function() {
            if (!$scope.newComment) {
                return;
            }

            apinetService.action({
                method: 'tasks/tasks/createComment',
                project: $stateParams.project,
                numpp: $scope.numpp,
                text: $scope.newComment
            }).then(function(response) {
                $scope.models.unshift(response);
                $scope.newComment = null;
                //Needs refresh, because paging will duplicate element if go to nest page after adding
                $scope.refreshList(false);//refresh with drop to first page
            }, handleException);
        };
    }]);
});
