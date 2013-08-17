angular.module('core')
    .service("eventsService", ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
            angular.extend(this, {
                reports: {},
                messages: {},
                reloadEvents: function() {
                    var that = this;

                    // ajax request
                    $timeout(function() {

                        that.reports = {
                            "gen": [{
                                "name": "report1",
                                "percent": 20
                            }],
                            "done": [{
                                "name": "report 2"
                            }]
                        }
                        $rootScope.$broadcast('events:reportsChanged');

                    }, 2000);
                }


            });
        }
    ]);