angular.module('core.security.backendless', ['core', 'ngMockE2E'])
.run(['$httpBackend', function($httpBackend) {

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

	var projMatrix = {
		play2: {
			admins: [ivanov],
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
		for(var group in p) {
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
			return [200, {user: found}];
		});

	//fake logout
	$httpBackend.whenPOST('/logout').respond(204);

	//fake user groups
	$httpBackend.whenPOST('/user-groups').respond(function(method, url, data, headers) {
		var prms = JSON.parse(data);
		return [200, {groups: userGroups(prms.project, prms.userId)}];
	});


	//all others
	$httpBackend.whenGET(/^(projects|ng-modules|components)*/).passThrough();
	$httpBackend.whenPOST(/^(\/api)*/).passThrough();
}]);