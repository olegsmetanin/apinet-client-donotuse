/* global angular: true */
angular.module('core')
	.directive('structuredFilter', ['sysConfig', 'helpers', 'filterHelpers', 'metadataService',
		function(sysConfig, $helpers, $filterHelpers, $metadataService) {
			return {
				replace: true,
				templateUrl: sysConfig.src('core/parts/filters/structuredFilter.tpl.html'),
				controller: ['$scope', function($scope) {
					function doEditNode(isNew, isRoot) {
						$scope.newNodeParent = isNew ? (isRoot ? $scope.rootNode : $scope.selectedNode) : null;
						$scope.editingNode = !isNew && $scope.selectedNode ?
							angular.extend({ }, $scope.selectedNode) : $filterHelpers.createNewNode();
						$scope.editingNode.items = [];
					}

					$scope.$on('selectNode', function(e, args) {
						$scope.selectedNode = args.node;
						$scope.isCompositeSelected = $filterHelpers.isCompositeNode(
							args.node, args.metadata);
					});

					$scope.$on('editNode', function() {
						doEditNode(false, false);
					});

					$scope.$on('cancelEdit', function() {
						$scope.editingNode = null;
						$scope.newNodeParent = null;
					});

					$scope.$on('clear', function() {
						$scope.selectedNode = null;
					});

					$scope.$watch('rootNode', function() {
						$scope.editingNode = null;
						$scope.newNodeParent = null;
					}, true);

					angular.extend($scope, {
						selectedNode: null,
						editingNode: null,
						newNodeParent: null,
						isCompositeSelected: false,

						getMetadata: function() {
							if(!$scope.metadata) {
								$scope.metadata = $metadataService.modelMetadata($scope.modelName);
							}
							return $scope.metadata;
						},

						newRootNode: function() {
							doEditNode(true, true);
						},

						newNode: function() {
							doEditNode(true, false);
						},

						editNode: function() {
							doEditNode(false, false);
						},

						deleteNode: function() {
							$scope.$emit('deleteNode', { node: $scope.selectedNode });
							$scope.selectedNode = null;
						},

						clearNodes: function() {
							$scope.$emit('clear');
						}
					});
				}]
			};
		}
	])
	.directive('structuredFilterNode', ['sysConfig', 'helpers', 'filterHelpers', 'metadataService',
		function(sysConfig, $helpers, $filterHelpers, $metadataService) {
			return {
				replace: true,
				scope: {
					node: '=',
					rootNode: '=',
					selectedNode: '=',
					editingNode: '=',
					newNodeParent: '=',

					getParentMetadata: '&'
				},
				templateUrl: sysConfig.src('core/parts/filters/structuredFilterNode.tpl.html'),
				controller: ['$scope', function($scope) {
					function beforeNodeEdit(node) {
						if(node.not) {
							if(node.op === '&&') {
								node.op = '&&!';
							}
							if(node.op === '=') {
								node.op = '!=';
							}
							if(node.op === 'exists') {
								node.op = 'not exists';
							}
							if(node.op === 'like') {
								node.op = 'not like';
							}
						}

						if(node.op === '&&' || node.op === '||' || node.op === '&&!') {
							node.path = node.op;
							node.op = '';
						}

						return node;
					}

					function afterNodeEdit(node) {
						node.path = $helpers.trim(node.path);
						node.op = $helpers.trim(node.op);
						node.value = $helpers.trim(node.value);

						if(node.path === '&&' || node.path === '||' || node.path === '&&!') {
							node.op = node.path;
							node.path = '';
						}

						if(node.not) {
							node.not = false;
						}
						if(node.op === '&&!') {
							node.op = '&&';
							node.not = true;
						}
						if(node.op === '!=') {
							node.op = '=';
							node.not = true;
						}
						if(node.op === 'not exists') {
							node.op = 'exists';
							node.not = true;
						}
						if(node.op === 'not like') {
							node.op = 'like';
							node.not = true;
						}

						return node;
					}

					$scope.$watch('editingNode', function(newValue) {
						if(!newValue) {
							$scope.editMode = false;
						}
						else if((!$scope.newNodeParent && $scope.node === $scope.selectedNode) ||
								$scope.newNodeParent === $scope.node) {

							beforeNodeEdit(newValue);
							$scope.resetValidationErrors();
							$scope.editMode = true;
						}
					});

					$scope.$watch('selectedNode', function(newValue) {
						$scope.nodeDataClass = {
							nodeData: true,
							selectedNodeData: newValue === $scope.node
						};
					});

					$scope.$watch('node.path', function(newValue) {
						$scope.pathDisplayName = $filterHelpers.pathDisplayName(newValue, null, $scope.getMetadata());
					}, true);

					$scope.$watch('node.op', function(newValue) {
						$scope.opDisplayName = $filterHelpers.opDisplayName(newValue, $scope.node.not);
					}, true);

					$scope.$watch('node.not', function(newValue) {
						$scope.opDisplayName = $filterHelpers.opDisplayName($scope.node.op, newValue);
					}, true);

					$scope.$watch('node.value', function(newValue) {
						$scope.valueDisplayName = $filterHelpers.valueDisplayName(newValue, $scope.getMetadata());
					}, true);

					angular.extend($scope, {
						nodeDataClass: { nodeData: true },
						nodeChildrenClass: { nodeChildren: $scope.node !== $scope.rootNode },
						editMode: false,
						pathDisplayName: null,
						opDisplayName: null,
						valueDisplayName: null,

						getMetadata: function() {
							var metadata = $scope.metadata, parentMetadata, node = $scope.node;
							if(!metadata) {
								parentMetadata = $scope.getParentMetadata();

								if($filterHelpers.isSpecialNode(node)) {
									metadata = parentMetadata;
								}
								else {
									if (node.path && parentMetadata && parentMetadata.PrimitiveProperties &&
											parentMetadata.PrimitiveProperties[node.path]) {
										metadata = parentMetadata.PrimitiveProperties[node.path];
									}

									if (node.path && parentMetadata && parentMetadata.ModelProperties &&
											parentMetadata.ModelProperties[node.path]) {
										metadata = parentMetadata.ModelProperties[node.path];
									}
								}

								$scope.metadata = metadata;
							}

							if(metadata && metadata.ModelType &&
									!(metadata.PrimitiveProperties || metadata.ModelProperties)) {
								angular.extend(metadata, $metadataService.modelMetadata(metadata.ModelType));
							}

							return metadata;
						},

						onNodeClick: function($event) {
							if($event) {
								$event.stopPropagation();
								$event.preventDefault();
							}

							if($scope.editingNode) {
								return;
							}

							$scope.$emit('selectNode', { node: $scope.node, metadata: $scope.getMetadata() });
						},

						onNodeDblClick: function($event) {
							if($event) {
								$event.stopPropagation();
								$event.preventDefault();
							}

							if($scope.editingNode) {
								return;
							}

							$scope.$emit('editNode');
						},

						onSaveEditor: function() {
							var changedNode = afterNodeEdit($scope.editingNode);
							var metadata = $scope.editingNodeMetadata;

							$scope.resetValidationErrors();
							if(!$filterHelpers.validateNode(changedNode, metadata, $scope.validationErrors)) {
								return;
							}

							if($scope.newNodeParent) {
								$scope.$emit('addNode', {
									node: changedNode,
									metadata: metadata,
									parent: $scope.newNodeParent,
									parentMetadata: $scope.getMetadata()
								});
							}
							else {
								$scope.metadata = metadata;

								$scope.$emit('updateNode', {
									node: $scope.node,
									metadata: metadata,
									changedNode: changedNode
								});

								$scope.$emit('selectNode', { node: $scope.node, metadata: metadata });
							}

							$scope.$emit('cancelEdit');
						},

						onCancelEditor: function() {
							$scope.resetValidationErrors();
							$scope.$emit('cancelEdit');
						},

						resetValidationErrors: function() {
							$scope.validationErrors = {
								path: [],
								op: [],
								value: []
							};
						}
					});
				}]
			};
		}])
	.directive('structuredFilterSubnode', function($compile) {
		return {
			replace: true,
			scope: {
				node: '=',
				rootNode: '=',
				selectedNode: '=',
				editingNode: '=',
				newNodeParent: '=',

				getParentMetadata: '&'
			},
			controller: ['$scope', function($scope) {
				angular.extend($scope, {
					getMetadata: function() {
						return $scope.getParentMetadata();
					}
				});
			}],
			link: function (scope, element) {
				element.append([
					'<div structured-filter-node',
					'   node="node"',
					'   root-node="rootNode"',
					'   selected-node="selectedNode"',
					'   editing-node="editingNode"',
					'   new-node-parent="newNodeParent"',
					'   get-parent-metadata="getMetadata()">',
					'</div>'
				].join('\n'));
				$compile(element.contents())(scope);
			}
		};
	})
	.directive('structuredFilterNodeEditor', ['sysConfig', 'filterHelpers', '$filter',
		function(sysConfig, $filterHelpers, $filter) {
			return {
				replace: true,
				templateUrl: sysConfig.src('core/parts/filters/structuredFilterNodeEditor.tpl.html'),
				controller: ['$scope', function($scope) {
					$scope.$watch('editingNode.path', function(newValue, oldValue) {
						var parentMetadata = !$scope.newNodeParent ? $scope.getParentMetadata() : $scope.getMetadata(),
							metadata = parentMetadata, i, node = $scope.editingNode;

						if(oldValue && node) {
							node.op = '';
							node.value = '';
						}

						if (newValue && metadata && metadata.PrimitiveProperties &&
								metadata.PrimitiveProperties[newValue]) {
							metadata = metadata.PrimitiveProperties[newValue];
						}

						if (newValue && metadata && metadata.ModelProperties &&
								metadata.ModelProperties[newValue]) {
							metadata = metadata.ModelProperties[newValue];
						}

						$scope.editingNodeMetadata = metadata;

						$scope.paths = $filterHelpers.applicablePaths(parentMetadata);
						for(i = 0; i < $scope.paths.length; i++) {
							$scope.paths[i] = {
								value: $scope.paths[i],
								label: $filterHelpers.pathDisplayName($scope.paths[i], parentMetadata)
							};
						}

						$scope.ops = $filter('applicableOps') ($filterHelpers.allOps(), metadata);
						for(i = 0; i < $scope.ops.length; i++) {
							$scope.ops[i] = {
								value: $scope.ops[i],
								label: $filterHelpers.opDisplayName($scope.ops[i])
							};
						}

						$scope.opSelectVisible = metadata ?
							!$filterHelpers.isCompositeNode(node, metadata) : false;
					}, true);

					$scope.$watch('editingNode.op', function(newValue) {
						$scope.valueEditorUrl = null;

						var metadata = $scope.editingNodeMetadata;
						if(newValue && metadata && metadata.PropertyType &&
								!$filterHelpers.isUnaryNode($scope.editingNode)) {
							var editorType = 'text';
							if(metadata.PropertyType === 'date' || metadata.PropertyType === 'datetime' ||
								metadata.PropertyType === 'boolean' || metadata.PropertyType === 'enum') {
								editorType = metadata.PropertyType;
							}

							$scope.valueEditorUrl = sysConfig.src('core/filters/') +
								editorType + 'ValueEditor.tpl.html';
						}
					}, true);

					angular.extend($scope, {
						paths: [],
						ops: [],
						editingNodeMetadata: null,
						editorType: 'text',
						opSelectVisible: false,
						valueEditorUrl: null
					});
				}]
			};
		}
	]);