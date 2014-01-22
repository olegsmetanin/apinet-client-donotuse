define([
	'../../moduleDef',
	'angular',
	'text!./tagEditor.tpl.html'
], function (module, angular, tpl) {
	module.directive('tagEditor', ['$q', '$window', '$compile', 'i18n',
		function($q, $window, $compile, i18n) {
			var compiledTpl = $compile(tpl);

			return {
				restrict: 'E',
				replace: true,
				scope: {
					tag: '=',
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

						/*newTag: function() {
							console.log('newTag');
							//$scope.validation = { success: true };
							//$scope.tag = { Name: $rootScope.i18n.core.tags.newTag };

						},

						doCreate: function(name) {
							console.log('doCreate', name);
							if(!name || !name.length || !$scope.tag) {
								return;
							}

							$scope.validation = { success: true };
							$scope.newName = $rootScope.i18n.core.tags.newTag;
							//$scope.tag.Name = $rootScope.i18n.core.tags.newTag;*/


							//console.log('doCreated', name);
							/*var deferred = $q.defer();
							deferred.promise.then(function(createdTag) {
								console.log('created', createdTag);
								if($scope.children && $scope.children.length) {
									if(!$scope.children[0]) {
										$scope.children.splice(0, 1);
									}
								}

								$scope.children = $scope.children || [];
								$scope.children.unshift(createdTag);
								$scope.children.unshift(null);
							}, function(validation) {
								$scope.validation = validation;
							});

							$scope.createTag({ parentId: $scope.parentId, name: name, deferred: deferred });
						},*/

						doUpdate: function(name) {
							console.log('doUpdate', name, $scope.tag);

							if(!name || !name.length || !$scope.tag) {
								return;
							}

							$scope.validation = { success: true };
							var deferred = $q.defer();

							if(!$scope.tag.Id || $scope.tag.parentId) {
								deferred.promise.then(function(createdTag) {
									console.log('created', createdTag);
									
									/*if($scope.children && $scope.children.length) {
										if(!$scope.children[0]) {
											$scope.children.splice(0, 1);
										}
									}

									$scope.children = $scope.children || [];
									$scope.children.unshift(createdTag);
									$scope.children.unshift(null);*/
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
							if(!$scope.tag || !$scope.tag.Id) {
								return;
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
								console.log('deleted', id);
							}, function(validation) {
								$scope.validation = validation;
							});

							$scope.deleteTag({ id: $scope.tag.Id, deferred: deferred });
						},

						expandChildren: function() {
							if(!$scope.tag || !$scope.tag.Id || $scope.children) {
								return;
							}

							console.log('expandChildren');

							var deferred = $q.defer();

							deferred.promise.then(function(tags) {
								$scope.children = tags || [];
								//$scope.children.unshift(null);
								$scope.renderChildren();

								$scope.expanded = true;
							});

							$scope.loadTags({ parentId: $scope.tag.Id, deferred: deferred });
						},

						collapseChildren: function() {
							console.log('collapseChildren');

							$scope.children = null;
							$scope.clearChildren();

							$scope.expanded = false;
						}
					});
				}],
				link: function($scope, element) {
					compiledTpl($scope, function(cloned) {
						element.replaceWith(cloned);
						$scope.childrenContainer = $('.nodeChildrenContainer', cloned);

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
					});
				}
			};
		}]);
});