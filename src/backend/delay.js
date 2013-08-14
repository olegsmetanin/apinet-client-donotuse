var delay = 1000;
angular.module('backend')
.factory('delayResponseInterceptor', function($q, $timeout) {
  return function(promise) {
    //Make every new http request be delayed more
    var deferred = $q.defer();
    return promise.then(function(response) {
      $timeout(function() {
        deferred.resolve(response);
      }, delay);
      return deferred.promise;
    }, function(response) {
      $timeout(function() {
        deferred.reject(response);
      }, delay);
      return deferred.promise;
    });
  };
})
.config(function($httpProvider) {
  $httpProvider.responseInterceptors.unshift('delayResponseInterceptor');
});