angular.module('core')
	.directive('structuredFilter', ['sysConfig', 'helpers', 'filterHelpers', 'metadataService',
		function(sysConfig, $helpers, $filterHelpers, $metadataService) {
			return {
				replace: true,
				templateUrl: sysConfig.src('core/parts/filters/structuredFilter.tpl.html'),
				scope: {
					rootNode: '=',
					modelType: '='
				},
				controller: ['$scope', function($scope) {
					angular.extend($scope, {
						shared: {
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
						},

						getMetadata: function(forceRefresh) {
							if(forceRefresh || !$scope.metadata) {
								$scope.metadata = $metadataService.modelMetadata($scope.modelType);
							}
							return $scope.metadata;
						},

						newRootNode: function() {
							if($scope.shared.editMode) {
								return;
							}

							$scope.$broadcast('newRootNode');
						},

						newNode: function() {
							if($scope.shared.editMode) {
								return;
							}

							$scope.$broadcast('newNode');
						},

						editNode: function() {
							if($scope.shared.editMode) {
								return;
							}

							$scope.$broadcast('editNode');
						},

						deleteNode: function() {
							if($scope.shared.editMode) {
								return;
							}

							$scope.$broadcast('deleteNode');
						},

						clear: function() {
							$scope.rootNode.items = [];

							$scope.shared.selectedNode = null;
							$scope.shared.isCompositeSelected = false;
							$scope.shared.editMode = null;
						}
					});

					$scope.$watch('rootNode', function(value) {
						if(value) {
							value.op = '&&';
							delete value.path;
							delete value.value;
							delete value.not;
							if(!value.items) {
								value.items = [];
							}
						}
					}, true);

					$scope.$watch('shared.selectedNode', function() {
						$scope.refreshActionsState();
					}, true);

					$scope.$watch('shared.editMode', function() {
						$scope.refreshActionsState();
					}, true);
				}]
			};
		}
	])
	.directive('structuredFilterNode', ['sysConfig', 'helpers', 'filterHelpers', 'metadataService', '$compile',
		function(sysConfig, $helpers, $filterHelpers, $metadataService, $compile) {
			return {
				replace: true,
				scope: {
					node: '=',
					rootNode: '=',
					shared: '=',
					getParentMetadata: '&'
				},
				templateUrl: sysConfig.src('core/parts/filters/structuredFilterNode.tpl.html'),
				controller: ['$scope', function($scope) {
					angular.extend($scope, {
						nodeChildrenClass: { nodeChildren: $scope.node !== $scope.rootNode },
						editMode: null,
						pathDisplayName: null,
						opDisplayName: null,
						valueDisplayName: null,

						getMetadata: function(forceRefresh) {
							if(forceRefresh || !$scope.metadata) {
								$scope.metadata = $filterHelpers.getNodeMetadata(
									$scope.node, $scope.getParentMetadata());
							}

							return $scope.metadata;
						},

						selectNode: function(node, metadata) {
							$scope.shared.selectedNode = node;
							$scope.shared.isCompositeSelected = $filterHelpers.isCompositeNode(
								node, metadata ? metadata : $scope.getMetadata());
						},

						commitEdit: function(changedNode) {
							if($scope.editMode === 'edit') {
								angular.extend($scope.node, changedNode);
								$scope.selectNode($scope.node, $scope.getMetadata(true));
							}
							else if($scope.editMode === 'new') {
								$scope.node.items.push(changedNode);
								$scope.selectNode(changedNode, $filterHelpers.getNodeMetadata(
									changedNode, $scope.getMetadata()));
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
						}
					});

					$scope.$watch('node.path', function(value) {
						$scope.pathDisplayName = $filterHelpers.pathDisplayName(value, null, $scope.getMetadata());
					}, true);

					$scope.$watch('node.op', function(value) {
						$scope.opDisplayName = $filterHelpers.opDisplayName(value, $scope.node.not, $scope.node.path);
					}, true);

					$scope.$watch('node.not', function(value) {
						$scope.opDisplayName = $filterHelpers.opDisplayName($scope.node.op, value, $scope.node.path);
					}, true);

					$scope.$watch('node.value', function(value) {
						$scope.valueDisplayName = $filterHelpers.valueDisplayName(value, $scope.getMetadata());
					}, true);

					$scope.$watch('shared.selectedNode', function(value) {
						$scope.nodeDataClass = {
							nodeData: true,
							selectedNodeData: value === $scope.node
						};
					});

					$scope.$on('newRootNode', function() {
						if($scope.node === $scope.rootNode) {
							$scope.editMode = 'new';
							$scope.editingNode = $scope.createNewNode();
						}
					});

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
					});
				}],
				link: function($scope, element) {
					angular.extend($scope, {
						onNodeClick: function($event) {
							if($event) {
								$event.stopPropagation();
								$event.preventDefault();
							}

							if($scope.shared.editMode) {
								return;
							}
							$scope.selectNode($scope.node);
						},

						onNodeDblClick: function($event) {
							if($event) {
								$event.stopPropagation();
								$event.preventDefault();
							}

							$scope.editNode();
						}
					});

					$scope.$watch('node.items', function(value) {
						var container = angular.element(angular.element(element.children()[2]).children()[0]);
						container.html('');

						if(!value || !value.length) {
							return;
						}

						var template = angular.element([
								'<div structured-filter-node',
								'   ng-repeat="subNode in node.items"',
								'   node="subNode"',
								'   root-node="rootNode"',
								'   shared="shared"',
								'   get-parent-metadata="getMetadata()">',
								'</div>'
							].join('\n'));

						$compile(template)($scope);
						container.html(template);
					}, true);

					$scope.$watch('editMode', function(value) {
						$scope.shared.editMode = value;

						var nodeEditorContainer = angular.element(element.children()[1]);
						var newNodeEditorContainer = angular.element(angular.element(element.children()[2]).children()[1]);

						if(!value) {
							nodeEditorContainer.html('');
							newNodeEditorContainer.html('');
							return;
						}

						var getParentMetadataFn = value === 'new' ? 'getMetadata()' : 'getParentMetadata()';
						var template = angular.element([
							'<div structured-filter-node-editor',
							'   node="editingNode"',
							'   shared="shared"',
							'   get-parent-metadata="' + getParentMetadataFn + '"',
							'   commit-edit="commitEdit(changedNode)"',
							'   cancel-edit="cancelEdit()">',
							'</div>'
						].join('\n'));
						$compile(template)($scope);

						if(value === 'new') {
							newNodeEditorContainer.html(template);
						}
						else if(value === 'edit') {
							nodeEditorContainer.html(template);
						}
					}, true);
				}
			};
		}])
	.directive('structuredFilterNodeEditor', ['sysConfig', 'filterHelpers', '$filter',
		function(sysConfig, $filterHelpers, $filter) {
			return {
				replace: true,
				templateUrl: sysConfig.src('core/parts/filters/structuredFilterNodeEditor.tpl.html'),
				scope: {
					node: '=',
					shared: '=',
					getParentMetadata: '&',
					commitEdit: '&',
					cancelEdit: '&'
				},
				controller: ['$scope', function($scope) {
					angular.extend($scope, {
						paths: [],
						ops: [],
						opSelectVisible: false,
						valueEditorUrl: null,
						tempNode: {
							value: $scope.node.value
						},

						getMetadata: function(forceRefresh) {
							if(forceRefresh || !$scope.metadata) {
								$scope.metadata = $filterHelpers.getNodeMetadata(
									$scope.node, $scope.getParentMetadata());
							}

							return $scope.metadata;
						},

						resetValidationErrors: function() {
							$scope.validationErrors = {
								path: [],
								op: [],
								value: []
							};
						}
					});

					$scope.$watch('node.path', function (value, oldValue) {
						if (oldValue && oldValue !== value) {
							$scope.node.op = '';
							$scope.node.value = '';
						}
						
						$scope.ops = $filter('applicableOps')($filterHelpers.allOps(), $scope.getMetadata(true));
						if(!$scope.node.op && $scope.ops.length) {
							$scope.node.op = $scope.ops[0];
						}
						for (i = 0; i < $scope.ops.length; i++) {
							$scope.ops[i] = {
								value: $scope.ops[i],
								label: $filterHelpers.opDisplayName($scope.ops[i])
							};
						}

						$scope.opSelectVisible = !$filterHelpers.isCompositeNode(
							$scope.node, $scope.getMetadata());
					}, true);

					$scope.$watch('node.op', function (value) {				
						$scope.valueEditorUrl = null;
						var metadata = $scope.getMetadata();
						if(!value || !metadata.PropertyType || $filterHelpers.isUnaryNode($scope.node)) {
							return;
						}

						var editorType = 'text';
						if (metadata.PropertyType === 'date' || metadata.PropertyType === 'datetime' ||
							metadata.PropertyType === 'boolean' || metadata.PropertyType === 'enum') {
							editorType = metadata.PropertyType;
						}

						$scope.valueEditorUrl = sysConfig.src('core/parts/filters/') +
							editorType + 'ValueEditor.tpl.html';
					}, true);

					$scope.$watch('node.value', function (value, oldValue) {
						if(value === oldValue) {
							return;
						}
						$scope.tempNode.value = value;
					}, true);

					$scope.$watch('tempNode.value', function (value, oldValue) {
						if(value === oldValue) {
							return;
						}
						$scope.node.value = value;
					}, true);

					$filterHelpers.beforeNodeEdit($scope.node);

					$scope.paths = $filterHelpers.applicablePaths($scope.getParentMetadata());
					if(!$scope.node.path && $scope.paths.length) {
						$scope.node.path = $scope.paths[0];
					}
					for(var i = 0; i < $scope.paths.length; i++) {
						$scope.paths[i] = {
							value: $scope.paths[i],
							label: $filterHelpers.pathDisplayName($scope.paths[i], $scope.getParentMetadata())
						};
					}

					$scope.resetValidationErrors();
				}],
				link: function($scope) {
					angular.extend($scope, {
						onSaveEditor: function () {
							var node = angular.extend({ }, $scope.node);
							var metadata = $scope.getMetadata();

							$filterHelpers.afterNodeEdit(node, metadata);
							$scope.resetValidationErrors();
							if (!$filterHelpers.validateNode(node, metadata, $scope.validationErrors)) {
								return;
							}

							$scope.commitEdit({ changedNode: node });
						},

						onCancelEditor: function () {
							$scope.cancelEdit();
						}
					});
				}
			};
		}
	]);