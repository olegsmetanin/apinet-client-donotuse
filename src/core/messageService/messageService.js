angular.module('core')
    .service("messageService", ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
            angular.extend(this, {
                messages: {},
                reloadMessages: function() {
                    var that = this;

                    // ajax request
                    $timeout(function() {

                        that.messages = [{
                            "date": new Date(),
                            "message": "message 1"
                        }]
                        $rootScope.$broadcast('events:eventsChanged');

                    }, 2000);
                }


            });
        }
    ]);