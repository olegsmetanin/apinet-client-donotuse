define([
	'../../moduleDef',
	'angular',
	'text!./tagEditor.tpl.html'
], function (module, angular, tpl) {
	module.directive('tagEditor', ['$q', '$window', '$compile', 'i18n',
		function($q, $window, $compile, i18n) {
			return {
				restrict: 'E',
				replace: true,
				template: tpl,
				scope: {
					tag: '=',
					owningList: '=',
					loadTags: '&',
					createTag: '&',
					updateTag: '&',
					deleteTag: '&'
				},
				controller: ['$scope', '$rootScope', function($scope, $rootScope) {
					angular.extend($scope, {
						validation: { success: true },
						children: null,
						childrenContainer: null,
						expanded: false,

						doUpdate: function(name) {
							if(!name || !name.length || !$scope.tag) {
								return;
							}

							$scope.validation = { success: true };
							var deferred = $q.defer();

							if(!$scope.tag.Id || $scope.tag.parentId) {
								deferred.promise.then(function(createdTag) {
									$scope.owningList = $scope.owningList || [];

									for(var i = 0; i < $scope.owningList.length; i++) {
										if($scope.owningList[i] && !$scope.owningList[i].Id) {
											$scope.owningList.splice(i, 1);
											break;
										}
									}

									$scope.owningList.unshift(createdTag);
								}, function(validation) {
									$scope.validation = validation;
								});

								$scope.createTag({
									parentId: $scope.tag.parentId,
									name: name,
									deferred: deferred
								});
							}
							else {
								deferred.promise.then(function(updatedTag) {
									if($scope.tag && updatedTag) {
										$scope.tag.Name = updatedTag.Name;
									}
								}, function(validation) {
									$scope.validation = validation;
								});

								$scope.updateTag({ id: $scope.tag.Id, name: name, deferred: deferred });
							}
						},

						doDelete: function() {
							if(!$scope.tag) {
								return;
							}

							if(!$scope.tag.Id) {
								$scope.owningList = $scope.owningList || [];

								for(var i = 0; i < $scope.owningList.length; i++) {
									if($scope.owningList[i] === $scope.tag) {
										$scope.owningList.splice(i, 1);
										return;
									}
								}
							}

							var confirmed = false;
							if (!$rootScope.$$phase) {
								$scope.$apply(function() {
									confirmed = $window.confirm(i18n.msg('core.confirm.delete.record'));
								});
							}
							else {
								confirmed = $window.confirm(i18n.msg('core.confirm.delete.record'));
							}
							if(!confirmed) {
								return;
							}

							$scope.validation = { success: true };

							var deferred = $q.defer();
							deferred.promise.then(function(id) {
								$scope.owningList = $scope.owningList || [];

								for(var i = 0; i < $scope.owningList.length; i++) {
									if($scope.owningList[i] && $scope.owningList[i].Id === id) {
										$scope.owningList.splice(i, 1);
										break;
									}
								}
							}, function(validation) {
								$scope.validation = validation;
							});

							$scope.deleteTag({ id: $scope.tag.Id, deferred: deferred });
						},

						expandChildren: function() {
							if(!$scope.tag || !$scope.tag.Id || $scope.children) {
								return;
							}

							var deferred = $q.defer();

							deferred.promise.then(function(tags) {
								$scope.children = tags || [];
								$scope.renderChildren();
								$scope.expanded = true;
							});

							$scope.loadTags({ parentId: $scope.tag.Id, deferred: deferred });
						},

						collapseChildren: function() {
							$scope.children = null;
							$scope.clearChildren();
							$scope.expanded = false;
						}
					});
				}],
				link: function($scope, element) {
					$scope.childrenContainer = $('.nodeChildrenContainer', element);

					$scope.renderChildren = function() {
						if(!$scope.children || !$scope.childrenContainer) {
							return;
						}

						var listTpl =
							'<tags-list load-tags="loadTags({ parentId: parentId, deferred: deferred })" ' +
							'   create-tag="createTag({ parentId: parentId, name: name, deferred: deferred })" '+
							'   update-tag="updateTag({ id: id, name: name, deferred: deferred })" ' +
							'   delete-tag="deleteTag({ id: id, deferred: deferred })" class="col-md-12" ' +
							'   tags="children"' +
							'   parent-id="' + $scope.tag.Id + '">' +
							'</tags-list>';

						$compile(listTpl)($scope, function(cloned) {
							$scope.childrenContainer.html('');
							$scope.childrenContainer.append(cloned);
						});
					};

					$scope.clearChildren = function() {
						if(!$scope.childrenContainer) {
							return;
						}
						$scope.childrenContainer.html('');
					};

					$scope.renderChildren();
				}
			};
		}]);
});