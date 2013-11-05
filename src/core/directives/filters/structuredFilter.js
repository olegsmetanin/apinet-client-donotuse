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

						/*shared: {
							selectedNode: null,
							isCompositeSelected: false,
							editMode: null
						},

						newRootNodeEnabled: false,
						newNodeEnabled: false,
						editNodeEnabled: false,
						deleteNodeEnabled: false,
						clearEnabled: false,

						refreshActionsState: function()
						{
							$scope.newRootNodeEnabled = !$scope.shared.editMode;
							$scope.newNodeEnabled = !$scope.shared.editMode && $scope.shared.selectedNode &&
								$scope.shared.isCompositeSelected;
							$scope.editNodeEnabled = !$scope.shared.editMode && $scope.shared.selectedNode;
							$scope.deleteNodeEnabled = !$scope.shared.editMode && $scope.shared.selectedNode;
							$scope.clearEnabled = !$scope.shared.editMode;
						},*/

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
							$scope.rootNode = { op: '&&', items: [
								{ op: '=', path: 'ProjectCode', value: 'Test' },
								{ op: '>', path: 'CreationTime', value: '2012-01-01' },
								{
									path: 'Creator',
									items: [
										{ op: '=', path: 'FIO', value: 'Test 2' }
									]
								}
							] };
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
						editingNode: $scope.node,

						nodeUpdated: function() {
							if($scope.context.metadata) {
								$filteringService.afterNodeEdit($scope.editingNode, $scope.context.metadata);
								angular.extend($scope.node, $scope.editingNode);
							}

							$scope.getMetadata(function(metadata) {
								var ctx = $scope.context;
								var node = $scope.node;

								if(ctx.path.dirty) {
									delete ctx.op.options;
								}

								resetContext();
								ctx = $scope.context;
								ctx.metadata = metadata;

								if(!ctx.op.options) {
									ctx.op.options = $filter('applicableOps')($filteringService.allOps(), metadata);
									if(!node.op && ctx.op.options.length) {
										node.op = ctx.op.options[0];
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
											if(!$scope.node.path && ctx.path.options.length) {
												$scope.node.path = ctx.path.options[0];
											}
											for(var i = 0; i < ctx.path.options.length; i++) {
												ctx.path.options[i] = {
													value: ctx.path.options[i],
													label: $filteringService.pathDisplayName(ctx.path.options[i], parentMeta)
												};
											}
										}
									});
								}

								angular.extend($scope.editingNode, node);
								$filteringService.beforeNodeEdit($scope.editingNode);

								var composite = $filteringService.isCompositeNode($scope.editingNode, metadata);
								var special = $filteringService.isSpecialNode($scope.editingNode);

								if(composite || special) {
									ctx.add = true;
									ctx.path.editable = !node.items || !node.items.length;
								}
								else {
									ctx.path.editable = true;
									ctx.op.editable = ctx.op.visible = !!node.path;

									ctx.value.editable = ctx.value.visible = !!node.path && !!node.op;
									if(ctx.value.editable) {
										ctx.value.editorType = 'text';
									}
								}

								console.log('prepared node', $scope.editingNode, ctx);
							}, $scope.context.path.dirty);
						},

						getMetadata: function(callback, forceRefresh) {
							if(forceRefresh || !$scope.context.metadata) {
								$scope.getParentMetadata({
									callback: function(parentMeta) {
										$filteringService.getNodeMetadata($scope.meta, $scope.node, parentMeta, function(metadata) {
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
						}/*,

						selectNode: function(node, metadata) {
							function selectNodeCallback(meta) {
								$scope.shared.selectedNode = node;
								$scope.shared.isCompositeSelected = $filteringService.isCompositeNode(node, meta);
							}

							if(metadata) {
								selectNodeCallback(metadata);
							}
							else {
								$scope.getMetadata(selectNodeCallback);
							}
						},

						/commitEdit: function(changedNode) {
							if($scope.editMode === 'edit') {
								$scope.getMetadata(function(metadata) {
									angular.extend($scope.node, changedNode);
									$scope.selectNode($scope.node, metadata);
								}, true);
							}
							else if($scope.editMode === 'new') {
								$scope.getMetadata(function(metadata) {
									$filteringService.getNodeMetadata($scope.meta, changedNode, metadata, function(changedNodeMeta) {
										$scope.node.items.push(changedNode);
										$scope.selectNode(changedNode, changedNodeMeta);
									});
								});
							}

							$scope.editMode = null;
						},

						cancelEdit: function() {
							$scope.editMode = null;
						},

						createNewNode: function() {
							return {
								path: '',
								op: '',
								value: '',
								items: [ ]
							};
						},

						onBeginEdit: function(property) {
							console.log('onBeginEdit', property);
						}*/
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

					/*$scope.$watch('node.path', function(value) {
						if($scope.node === $scope.rootNode) {
							return;
						}
						$scope.getMetadata(function(metadata) {
							$scope.pathDisplayName = $filteringService.pathDisplayName(value, null, metadata);
						});
					}, true);

					$scope.$watch('node.op', function(value) {
						if($scope.node === $scope.rootNode) {
							return;
						}
						$scope.opDisplayName = $filteringService.opDisplayName(value, $scope.node.not, $scope.node.path);
					}, true);

					$scope.$watch('node.path', function (value, oldValue) {
						$scope.getMetadata(function(metadata) {
							if (oldValue && oldValue !== value) {
								$scope.node.op = '';
								$scope.node.value = '';
							}

							$scope.ops = $filter('applicableOps')($filteringService.allOps(), metadata);
							if(!$scope.node.op && $scope.ops.length) {
								$scope.node.op = $scope.ops[0];
							}
							for (i = 0; i < $scope.ops.length; i++) {
								$scope.ops[i] = {
									value: $scope.ops[i],
									label: $filteringService.opDisplayName($scope.ops[i])
								};
							}

							$scope.opSelectVisible = !$filteringService.isCompositeNode(
								$scope.node, metadata);
						}, true);
					}, true);

					$scope.$watch('node.op', function (value) {
						$scope.getMetadata(function(metadata) {
							$scope.editorType = null;

							if(!value || !metadata.PropertyType || $filteringService.isUnaryNode($scope.node)) {
								return;
							}

							$scope.editorType = 'text';
							if (metadata.PropertyType === 'date' || metadata.PropertyType === 'datetime' ||
								metadata.PropertyType === 'boolean' || metadata.PropertyType === 'enum') {
								$scope.editorType = metadata.PropertyType;
							}
						});
					}, true);

					$scope.$watch('node.not', function(value) {
						if($scope.node === $scope.rootNode) {
							return;
						}
						$scope.opDisplayName = $filteringService.opDisplayName($scope.node.op, value, $scope.node.path);
					}, true);

					$scope.$watch('node.value', function(value) {
						if($scope.node === $scope.rootNode) {
							return;
						}
						$scope.getMetadata(function(metadata) {
							$scope.valueDisplayName = $filteringService.valueDisplayName(value, metadata);
						});
					}, true);



					$scope.$on('newNode', function() {
						if($scope.node === $scope.shared.selectedNode) {
							$scope.editMode = 'new';
							$scope.editingNode = $scope.createNewNode();
						}
					});

					$scope.$on('editNode', function() {
						if($scope.node === $scope.shared.selectedNode) {
							$scope.editMode = 'edit';
							$scope.editingNode = angular.extend({ }, $scope.node);
							$scope.editingNode.items = [];
						}
					});

					$scope.$on('deleteNode', function() {
						if($scope.node === $scope.shared.selectedNode) {
							var index = $scope.$parent.node.items.indexOf($scope.node);
							if(index === -1) {
								return;
							}

							$scope.$parent.node.items.splice(index, 1);
							$scope.shared.selectedNode = null;
						}
					});*/
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
	.directive('valueEditor', [function() {
		return {
			replace: true,
			link: function($scope, element, attrs) {
				attrs.$observe('valueEditor', function(editorType) {
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