angular.module('core')
    .service("reportService", ['$rootScope', '$timeout', '$http',
        function($rootScope, $timeout, $http) {
            angular.extend(this, {
                reports: {
                    gen: [],
                    done: []
                },

                setReports: function(new_reports) {
                    var that = this;
                    that.reports = new_reports;
                    $rootScope.$broadcast('events:reportsChanged');
                },

                generate: function(params) {
                    $http.post('/api/v1', params)
                },


                reloadReports: function() {
                    var that = this;

                    $http.post('/api/v1', {
                        action: "generateStatus",
                        model: "Generator"
                    }).then(function(response) {
                        that.reports = response.data.reports;
                        $rootScope.$broadcast('events:reportsChanged');
                    });



                },
                cancelReportGeneration: function(name) {
                    var that = this;
                    that.reports.gen = [];
                    $rootScope.$broadcast('events:reportsChanged');
                    // ajax request


                }


            });
        }
    ]);