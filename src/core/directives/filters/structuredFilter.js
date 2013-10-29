angular.module('core')
	.directive('structuredFilter', ['sysConfig', 'helpers', 'filteringService', 'metadataService',
		function(sysConfig, $helpers, $filteringService, $metadataService) {
			return {
				replace: true,
				templateUrl: sysConfig.src('core/directives/filters/structuredFilter.tpl.html'),
				scope: {
					rootNode: '=filterNgModel',
					meta: '='
				},
				controller: ['$scope', '$rootScope', function($scope, $rootScope) {
					$metadataService.reset();

					angular.extend($scope, {
						i18n: $rootScope.i18n,

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
						else {
							$scope.rootNode = { };
						}
					});

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
	.directive('structuredFilterNode', ['sysConfig', 'helpers', 'filteringService', 'metadataService', '$compile',
		function(sysConfig, $helpers, $filteringService, $metadataService, $compile) {
			return {
				replace: true,
				scope: {
					node: '=',
					rootNode: '=',
					shared: '=',
					meta: '=',
					getParentMetadata: '&'
				},
				templateUrl: sysConfig.src('core/directives/filters/structuredFilterNode.tpl.html'),
				controller: ['$scope', '$rootScope', function($scope, $rootScope) {
					angular.extend($scope, {
						i18n: $rootScope.i18n,

						nodeChildrenClass: { nodeChildren: $scope.node !== $scope.rootNode },
						editMode: null,
						pathDisplayName: null,
						opDisplayName: null,
						valueDisplayName: null,

						getMetadata: function(callback, forceRefresh) {
							if(forceRefresh || !$scope.metadata) {
								$scope.getParentMetadata({
									callback: function(parentMeta) {
										$filteringService.getNodeMetadata($scope.meta, $scope.node, parentMeta, function(metadata) {
											$scope.metadata = metadata;
											callback($scope.metadata);
										});
									}
								});
								return;
							}
							callback($scope.metadata);
						},

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

						commitEdit: function(changedNode) {
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
						}
					});

					$scope.$watch('node.path', function(value) {
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
								'   meta="meta"',
								'   get-parent-metadata="getMetadata(callback)">',
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

						var getParentMetadataFn = value === 'new' ? 'getMetadata(callback)' :
							'getParentMetadata({ callback: callback })';
						var template = angular.element([
							'<div structured-filter-node-editor',
							'   node="editingNode"',
							'   shared="shared"',
							'   meta="meta"',
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
	.directive('structuredFilterNodeEditor', ['sysConfig', 'filteringService', '$filter',
		function(sysConfig, $filteringService, $filter) {
			return {
				replace: true,
				templateUrl: sysConfig.src('core/directives/filters/structuredFilterNodeEditor.tpl.html'),
				scope: {
					node: '=',
					shared: '=',
					meta: '=',
					getParentMetadata: '&',
					commitEdit: '&',
					cancelEdit: '&'
				},
				controller: ['$scope', '$rootScope', function($scope, $rootScope) {
					angular.extend($scope, {
						i18n: $rootScope.i18n,

						paths: [],
						ops: [],
						opSelectVisible: false,
						valueEditorUrl: null,
						tempNode: {
							value: $scope.node.value
						},

						getMetadata: function(callback, forceRefresh) {
							if(forceRefresh || !$scope.metadata) {
								$scope.getParentMetadata({
									callback: function(parentMeta) {
										$filteringService.getNodeMetadata($scope.meta, $scope.node, parentMeta, function(metadata) {
											$scope.metadata = metadata;
											$scope.valueMetadata = metadata;

											callback($scope.metadata);
										});
									}
								});
								return;
							}
							callback($scope.metadata);
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
							$scope.valueEditorUrl = null;

							if(!value || !metadata.PropertyType || $filteringService.isUnaryNode($scope.node)) {
								return;
							}

							var editorType = 'text';
							if (metadata.PropertyType === 'date' || metadata.PropertyType === 'datetime' ||
								metadata.PropertyType === 'boolean' || metadata.PropertyType === 'enum') {
								editorType = metadata.PropertyType;
							}

							$scope.valueEditorUrl = sysConfig.src('core/directives/filters/') +
								editorType + 'ValueEditor.tpl.html';
						});
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

					$filteringService.beforeNodeEdit($scope.node);
					$scope.resetValidationErrors();

					$scope.getParentMetadata({
						callback: function(parentMeta) {
							$scope.paths = $filteringService.applicablePaths(parentMeta);
							if(!$scope.node.path && $scope.paths.length) {
								$scope.node.path = $scope.paths[0];
							}
							for(var i = 0; i < $scope.paths.length; i++) {
								$scope.paths[i] = {
									value: $scope.paths[i],
									label: $filteringService.pathDisplayName($scope.paths[i], parentMeta)
								};
							}
						}
					});
				}],
				link: function($scope) {
					angular.extend($scope, {
						onSaveEditor: function () {
							$scope.getMetadata(function(metadata) {
								var node = angular.extend({ }, $scope.node);

								$filteringService.afterNodeEdit(node, metadata);
								$scope.resetValidationErrors();
								if (!$filteringService.validateNode(node, metadata, $scope.validationErrors)) {
									return;
								}

								$scope.commitEdit({ changedNode: node });
							});
						},

						onCancelEditor: function () {
							$scope.cancelEdit();
						}
					});
				}
			};
		}
	]);