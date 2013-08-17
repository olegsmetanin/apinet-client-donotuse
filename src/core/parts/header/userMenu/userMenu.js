angular.module('security.login.toolbar', [])

// The loginToolbar directive is a reusable widget that can show login or logout buttons
// and information the current authenticated user
.directive('userMenu', ['security', 'sysConfig', function(security, sysConfig) {
  var directive = {
    templateUrl: sysConfig.src('core/parts/header/userMenu/userMenu.tpl.html'),
    restrict: 'EA',
    replace: true,
    scope: true,
    link: function($scope, $element, $attrs, $controller) {
      $scope.isAuthenticated = security.isAuthenticated;
      $scope.login = security.showLogin;
      $scope.logout = security.logout;
      $scope.$watch(function() {
        return security.currentUser;
      }, function(currentUser) {
        $scope.currentUser = currentUser;
      });
    }
  };
  return directive;
}]);