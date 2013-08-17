angular.module('core')
    .service("eventsService", ['$rootScope',
        function($rootScope) {
            angular.extend(this, {
                reports: {},
                messages: {},
                reloadEvents: function() {
                    // ajax request
                    this.reports = {
                        "gen": [{
                            "name": "report1",
                            "percent": 20
                        }],
                        "done": [{
                            "name": "report 2"
                        }]
                    }
                    $rootScope.$broadcast('events:reportsChanged');
                }


            });
        }
    ]);