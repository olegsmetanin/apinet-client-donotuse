angular.module('core')
    .service("reportService", ['$rootScope', '$timeout',
        function($rootScope, $timeout) {
            angular.extend(this, {
                reports: {
                    "gen": [{
                        "name": "report1",
                        "percent": 20
                    }],
                    "done": [{
                        "name": "report 2"
                    }]
                },
                reloadEvents: function() {
                    var that = this;

                    // ajax request
                    $timeout(function() {

                        if (that.reports.gen[0]) {
                            var currentPercent = that.reports.gen[0].percent;
                            currentPercent = (currentPercent > 100 ? 0 : currentPercent + 10);
                            that.reports.gen[0].percent = currentPercent;
                        }

                        $rootScope.$broadcast('events:reportsChanged');

                    }, 2000);
                },
                cancelReportGeneration: function(name) {
                    var that = this;
                    that.reports.gen = [];
                    // ajax request


                }


            });
        }
    ]);