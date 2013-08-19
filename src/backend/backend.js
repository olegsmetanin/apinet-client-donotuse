angular.module('backend', ['ngMockE2E'])
    .run(['$httpBackend', '$timeout', 'reportService',
        function($httpBackend, $timeout, reportService) {

            var userId = 0;



            var makeUser = function(fname, lname, isAdmin) {
                userId++;
                return {
                    id: userId,
                    firstName: fname,
                    lastName: lname,
                    email: fname + '.' + lname + '@abc.com',
                    admin: isAdmin
                };
            };

            var admin = makeUser('a', 'admin', true); //admin
            var ivanov = makeUser('ivan', 'ivanov', false); //project manager
            var petrov = makeUser('petr', 'petrov', false); //project executor
            var sidorov = makeUser('sidor', 'sidorov', false); //project executor
            var users = [admin, ivanov, petrov, sidorov];

            var currentUser = admin;


            var projMatrix = {
                play2: {
                    admins: [ivanov, admin],
                    managers: [ivanov, petrov],
                    executors: [sidorov]
                },
                prj2: {
                    admins: [ivanov],
                    managers: [ivanov],
                    executors: [petrov]
                }
            };

            var userGroups = function(proj, userId) {
                var p = projMatrix[proj];
                var groups = [];
                var user = null;
                angular.forEach(users, function(u) {
                    if (u.id === userId) {
                        user = u;
                    }
                });
                for (var group in p) {
                    if ($.inArray(user, p[group]) >= 0) {
                        groups.push(group);
                    }
                }
                return groups;
            };

            //fake login
            $httpBackend.whenPOST('/login').respond(
                function(method, url, data, headers) {
                    var prms = JSON.parse(data);
                    //test error on
                    if (prms.email === 'bad@abc.com') {
                        return [500, 'Oops, something went wrong'];
                    }

                    var found = null;
                    angular.forEach(users, function(u) {
                        if (u.email === prms.email && '111' === prms.password) {
                            found = angular.copy(u);
                        }
                    });

                    currentUser = found;

                    return [200, {
                        user: currentUser
                    }];
                });

            //fake logout
            $httpBackend.whenPOST('/logout').respond(function(method, url, data, headers) {
                currentUser = {};
                return [204];
            });

            //fake current-user
            $httpBackend.whenPOST('/current-user').respond(function(method, url, data, headers) {
                if (currentUser) {
                    return [200, {
                        user: currentUser
                    }];
                } else {
                    return [500, 'Oops, something went wrong'];
                }




            });


            //fake user groups
            $httpBackend.whenPOST('/user-groups').respond(function(method, url, data, headers) {
                console.log("post /user-groups", data);
                var prms = JSON.parse(data);
                return [200, {
                    groups: ['admins'] //userGroups(prms.project, prms.userId)
                }];
            });


            $httpBackend.whenPOST('/api/v1').respond(function(method, url, data, headers) {
                var prms = JSON.parse(data);
                if ((prms.action === "get") && (prms.model === "projects")) {
                    return getProjects();
                } else if ((prms.action === "generate") && (prms.model === "Project")) {
                    return generateProjectsReport(prms);
                } else if ((prms.action === "generateStatus") && (prms.model === "Generator")) {
                    return [200, {
                        reports: reportService.reports
                    }];
                } else {
                    return [500, 'Oops, something went wrong'];
                }
            });

            //all others
            $httpBackend.whenGET(/^(projects|ng-modules|components)*/).passThrough();
            $httpBackend.whenPOST(/^(\/api)*/).passThrough();

            var generateTimer;

            function updatePercent() {
                if (generateTimer) {
                    clearTimeout(generateTimer);
                }

                var gen = reportService.reports.gen;
                for (var i = 0; i < gen.length; i++) {
                    var currentPercent = gen[i].percent;
                    if (currentPercent >= 100) {
                        reportService.reports.done.unshift({
                            "name": gen[i].name,
                            "done": new Date()
                        });
                        reportService.reports.gen.splice(i, 1);

                        reportService.setReports(reportService.reports);
                    } else {
                        gen[i].percent = currentPercent + 10;
                        reportService.setReports(reportService.reports);
                    }
                }


                generateTimer = window.setTimeout(function() {
                    if (gen.length>0) {
                        updatePercent();
                    }
                }, 1000);
            }

            function generateProjectsReport(prms) {
                $timeout(function() {
                    if (!reportService.reports.gen) {
                        reportService.reports = {
                            gen: [],
                            done: []
                        };
                    }
                    reportService.reports.gen.unshift({
                        "name": prms.name,
                        "percent": 0
                    });
                    reportService.setReports(reportService.reports);

                    updatePercent();

                }, 1000);

                return [200];
            }

            function getProjects() {
                return [200, {
                    "projects": [{
                        "id": "play2",
                        "name": "Play 2.0"
                    }, {
                        "id": "prj2",
                        "name": "Play 1.2.4"
                    }, {
                        "id": "prj3",
                        "name": "Website"
                    }, {
                        "id": "prj4",
                        "name": "Secret project"
                    }, {
                        "id": "prj5",
                        "name": "Playmate"
                    }, {
                        "id": "prj6",
                        "name": "Things to do"
                    }]
                }];
            }



        }
    ]);