define([
	'angular',
	'../../moduleDef',
	'jquery',
	'text!./structuredFilter.tpl.html',
	'text!./structuredFilterNode.tpl.html',
	'text!./structuredFilterNodeEditor.tpl.html',
	'text!./booleanValueEditor.tpl.html',
	'text!./datetimeValueEditor.tpl.html',
	'text!./dateValueEditor.tpl.html',
	'text!./enumValueEditor.tpl.html',
	'text!./textValueEditor.tpl.html'
], function (angular, module, $, tpl, nodeTpl, nodeEditorTpl,
             booleanEditorTpl, datetimeEditorTpl, dateEditorTpl, enumEditorTpl, textEditorTpl) {

	var editorTpls = { };
	module.directive('structuredFilter', ['$compile', 'helpers', 'filteringService', 'metadataService',
		function($compile, $helpers, $filteringService, $metadataService) {
			angular.extend(editorTpls, {
				boolean: $compile(booleanEditorTpl),
				datetime: $compile(datetimeEditorTpl),
				date: $compile(dateEditorTpl),
				enum: $compile(enumEditorTpl),
				text: $compile(textEditorTpl)
			});

			return {
				replace: true,
				template: tpl,
				scope: {
					rootNode: '=filterNgModel',
					meta: '='
				},
				controller: ['$scope', '$rootScope', function($scope, $rootScope) {
					$metadataService.reset();

					angular.extend($scope, {
						i18n: $rootScope.i18n,

						getMetadata: function(callback, forceRefresh) {
							if(forceRefresh || !$scope.metadata) {
								$metadataService.modelMetadata($scope.meta, null, function(metadata) {
									$scope.metadata = metadata;
									callback($scope.metadata);
								});
								return;
							}
							callback($scope.metadata);
						},

						addNode: function() {
							$scope.$broadcast('addRootNode');
						},

						clear: function() {
							$scope.$broadcast('clear');
						}
					});

					var rootNodeWatch = function(value) {
						if(value) {
							value.op = '&&';
							delete value.path;
							delete value.value;
							delete value.not;
							if(!value.items) {
								value.items = [];
							}
						}
						else {
							$scope.rootNode = { op: '&&', items: [ ] };
						}
					};
					rootNodeWatch($scope.rootNode);
					$scope.$watch('rootNode', rootNodeWatch);
				}]
			};
		}
	])
	.directive('structuredFilterNode', ['helpers', 'filteringService', 'metadataService', '$compile', '$filter',
		function($helpers, $filteringService, $metadataService, $compile, $filter) {
			var compiledNodeTpl = $compile(nodeTpl);

			return {
				replace: true,
				scope: {
					node: '=',
					root: '@',
					meta: '=',
					getParentMetadata: '&'
				},
				controller: ['$scope', '$rootScope', function($scope, $rootScope) {
					var resetContext = function() {
						$scope.context = {
							metadata: null,
							add: $scope.root,
							delete: !$scope.root,
							hover: false,
							editing: false,
							validation: {
								path: [],
								op: [],
								value: [],
								valid: true
							},
							path: {
								editable: false,
								visible: true,
								dirty: false
							},
							op: {
								editable: false,
								visible: false,
								dirty: false
							},
							value: {
								editable: false,
								visible: false,
								dirty: false,
								editorType: null
							}
						};
					};

					angular.extend($scope, {
						i18n: $rootScope.i18n,
						editingNode: angular.extend({ }, $scope.node),

						nodeUpdated: function() {
							if($scope.context.metadata) {
								$filteringService.afterNodeEdit($scope.editingNode, $scope.context.metadata);
							}

							$scope.getMetadata(function(metadata) {
								var ctx = $scope.context;
								if(ctx.path.dirty) {
									delete ctx.op.options;
								}

								resetContext();
								ctx = $scope.context;
								ctx.metadata = metadata;

								if(!ctx.op.options) {
									ctx.op.options = $filter('applicableOps')($filteringService.allOps(), metadata);
									if(!$scope.editingNode.op && ctx.op.options.length) {
										$scope.editingNode.op = ctx.op.options[0];
									}
									for (var i = 0; i < ctx.op.options.length; i++) {
										ctx.op.options[i] = {
											value: ctx.op.options[i],
											label: $filteringService.opDisplayName(ctx.op.options[i])
										};
									}
								}
								
								if(!ctx.path.options) {
									$scope.getParentMetadata({
										callback: function(parentMeta) {
											ctx.path.options = $filteringService.applicablePaths(parentMeta);
											for(var i = 0; i < ctx.path.options.length; i++) {
												ctx.path.options[i] = {
													value: ctx.path.options[i],
													label: $filteringService.pathDisplayName(ctx.path.options[i], parentMeta)
												};
											}
										}
									});
								}

								var composite = $filteringService.isCompositeNode($scope.editingNode, metadata);
								var special = $filteringService.isSpecialNode($scope.editingNode);

								if(composite || special) {
									ctx.add = true;
									ctx.path.editable = !$scope.editingNode.items || !$scope.editingNode.items.length;
								}
								else {
									ctx.path.editable = true;
									ctx.op.editable = ctx.op.visible = !!$scope.editingNode.path;

									ctx.value.editable = ctx.value.visible = !!$scope.editingNode.path && !!$scope.editingNode.op;
									if(ctx.value.editable) {
										ctx.value.editorType = 'text';
									}
								}

								if ($filteringService.validateNode($scope.editingNode, ctx.metadata, ctx.validation)) {
									$scope.node = angular.extend({ }, $scope.editingNode);
								}
								$filteringService.beforeNodeEdit($scope.editingNode);

							}, $scope.context.path.dirty);
						},

						getMetadata: function(callback, forceRefresh) {
							if(forceRefresh || !$scope.context.metadata) {
								$scope.getParentMetadata({
									callback: function(parentMeta) {
										$filteringService.getNodeMetadata($scope.meta, $scope.editingNode, parentMeta, function(metadata) {
											$scope.context.metadata = metadata;
											callback($scope.context.metadata);
										});
									}
								});
								return;
							}
							callback($scope.context.metadata);
						},

						addNode: function() {
							if(!$scope.context.add) {
								return;
							}

							$scope.node.items.push({ op: '&&', items: [ ] });
							$scope.appendSubNode($scope.node.items.length - 1);
						},

						deleteNode: function() {
							if(!$scope.context.delete) {
								return;
							}

							var parentNode = $scope.$parent.node;
							if(!parentNode || !parentNode.items) {
								return;
							}

							var index = parentNode.items.indexOf($scope.node);
							if(index === -1) {
								return;
							}

							parentNode.items.splice(index, 1);
							$scope.$parent.renderSubNodes();
						}
					});

					if($scope.root) {
						$scope.$on('addRootNode', function() { $scope.addNode(); });

						$scope.$on('clear', function() {
							$scope.node.items = [];
							$scope.renderSubNodes();
						});
					}

					resetContext();
					$scope.nodeUpdated();
				}],
				link: function($scope, element) {
					var childrenContainer = $('<div />');

					$scope.appendSubNode = function(index) {
						$compile([
							'<div structured-filter-node',
								'node="node.items[' + index + ']"',
								'meta="meta"',
								'get-parent-metadata="getMetadata(callback)">',
							'</div>'].join('\n'))
						($scope, function(cloned) {
							childrenContainer.append(cloned);
						});
					};

					$scope.renderSubNodes = function() {
						childrenContainer.html('');

						$scope.node.items = $scope.node.items || [];
						for(var i = 0; i < $scope.node.items.length; i++) {
							$scope.appendSubNode(i);
						}
					};

					compiledNodeTpl($scope, function(cloned) {
						element.replaceWith(cloned);
						childrenContainer = $('.nodeChildrenContainer', cloned);

						$scope.renderSubNodes();
					});
				}
			};
		}])
	.directive('filterValueEditor', [function() {
		return {
			replace: true,
			link: function($scope, element, attrs) {
				attrs.$observe('filterValueEditor', function(editorType) {
					var linkFn = editorTpls[editorType];
					if(!linkFn) {
						return;
					}
					linkFn($scope, function(cloned) {
						element.replaceWith(cloned);
					});
				});
			}
		};
	}]);
});