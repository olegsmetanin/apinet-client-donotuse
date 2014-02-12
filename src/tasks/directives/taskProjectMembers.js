define([
	'../moduleDef',
	'angular',
	'text!./taskProjectMembers.tpl.html',
	'css!./taskProjectMembers.css'
], function (module, angular, tpl) {
	module.directive('taskProjectMembers', 
		['apinetService', '$stateParams', '$window', 'i18n', '$timeout',
		function(apinetService, $stateParams, $window, i18n, $timeout) {
		return {
			restrict: 'EA',
			replace: true,
			template: tpl,
			scope: {
				onError: '&'
			},
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				$scope.i18n = $rootScope.i18n;
			}],
			link: function(scope, elm, attrs) {
				scope.collapsed = true;

				scope.onSearchClick = function(e) {
					e.stopPropagation();
				};

				var unwatch = scope.$watch('collapsed', function(newVal, oldVal) {
					if (newVal !== oldVal) {
						if (!scope.collapsed) {
							scope.load();
							unwatch();
						}	
					}
				});

				//filter and paging for list
				var page = 0;
				//needed for counter directive
				scope.requestParams = {
					term: null
				};

				scope.searchTimeout = null;
				scope.$watch('requestParams.term', function() {
					if (scope.searchTimeout) {
						$timeout.cancel(scope.searchTimeout);
						scope.timeout = null;
					}

					scope.searchTimeout = $timeout(function() {
						scope.searchTimeout = null;
						scope.load(true);
					}, 600);
				});

				//new member form data
				scope.editables = {
					newMember: null,
					isAdmin: false,
					isManager: false,
					isExecutor: false,

					roles: function() {
						var roles = [];
						if (this.isAdmin) roles.push('Administrator');
						if (this.isManager) roles.push('Manager');
						if (this.isExecutor) roles.push('Executor');
						return roles;
					},

					clear: function() {
						this.newMember = null;
						this.isAdmin = false;
						this.isManager = false;
						this.isExecutor = false;
					}
				};

				scope.isMembersEditable = function() {
					return true;//TODO implement
				};

				scope.handleError = function(error) {
					if (angular.isFunction(scope.onError)) {
						scope.onError({error: error});
					} else {
						throw error;
					}
				};

				var mergeOrPush = function(source) {
					scope.models = scope.models || [];
					for(var srcIndex = 0; srcIndex < source.length; srcIndex++) {
						//find target for merge
						var merged = false;
						for(var mIndex = 0; mIndex < scope.models.length; mIndex++) {
							if (scope.models[mIndex].Id == source[srcIndex].Id) {
								angular.extend(scope.models[mIndex], source[srcIndex]);
								merged = true;
								break;
							}
						}
						if (!merged) {
							scope.models.push(source[srcIndex]);
						}
					}
				};

				scope.load = function(replace) {
					apinetService.action({
						method: 'tasks/project/getMembers',
						project: $stateParams.project,
						term: scope.requestParams.term,
						page: page
					}).then(function(response) {
						if (!!replace) {
							scope.models = response;
							page = 0;
						} else {
							mergeOrPush(response);
							if (response.length <= 0) {
								page--;
							}
						}
					}, scope.handleError);
				};

				scope.add = function() {
					//TODO use validators instead of try..catch
					try {
						apinetService.action({
							method: 'tasks/project/addMember',
							project: $stateParams.project,
							userId: scope.editables.newMember.id,
							roles: scope.editables.roles()
						}).then(function(response) {
							scope.models.unshift(response);
							scope.editables.clear();
						}, scope.onError);
					} catch(e) {
						scope.onError(e);
					}
				};

				scope.remove = function(member) {
					if (!member) {
						return;
					}

					if (!$window.confirm(i18n.msg('core.confirm.delete.record'))) {
						return;
					}

					apinetService.action({
						method: 'tasks/project/removeMember',
						memberId: member.Id
					}).then(function(response) {
						var index = scope.models.indexOf(member);
						if (index >= 0) {
							scope.models.splice(index, 1);
						}
					}, scope.onError);
				};

				scope.changeRoles = function(member, roles) {
					if (!member || !roles || roles.length <= 0) {
						return false;//cancel changes
					}

					apinetService.action({
						method: 'tasks/project/changeMemberRoles',
						memberId: member.Id,
						roles: roles.map(function(item){ return item.id })
					}).then(function(response) {
						if (response.validation.success) {
							angular.extend(member, response.model);
							member.validation = {};
						} else {
							member.validation = response.validation;
						}
						return response.validation.success;
					}, scope.onError);
				};

				scope.changeCurrentRole = function(member, role) {
					if (!member || !role) {
						return false;//cancel changes
					}

					apinetService.action({
						method: 'tasks/project/changeMemberCurrentRole',
						memberId: member.Id,
						current: role.id
					}).then(function(response) {
						if (response.validation.success) {
							angular.extend(member, response.model);
							member.validation = {};
						} else {
							member.validation = response.validation;
						}
						return response.validation.success;
					}, scope.onError);
				};

				scope.nextPage = function() {
					page++;
					scope.load(false);
				};
			}
		};
	}]);
});