angular.module('core')
	.directive('userFilter', ['sysConfig', 'helpers', 'filterHelpers', 'metadataService',
		function(sysConfig, $helpers, $filterHelpers, $metadataService) {
			return {
				replace: true,
				templateUrl: sysConfig.src('core/parts/filters/userFilter.tpl.html'),
				scope: {
					rootNode: '=',
					modelType: '='
				},
				controller: ['$scope', function($scope) {
					angular.extend($scope, {
						shared: {
							selectedNode: null,
							editMode: null
						},
						newNodeEnabled: false,
						editNodeEnabled: false,
						deleteNodeEnabled: false,
						clearEnabled: false,

						refreshActionsState: function()
						{
							$scope.newNodeEnabled = !$scope.shared.editMode;
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
	.directive('userFilterNode', ['sysConfig', 'helpers', 'filterHelpers', 'metadataService', '$compile', 'dictionaryService',
		function(sysConfig, $helpers, $filterHelpers, $metadataService, $compile, $dictionaryService) {
			return {
				replace: true,
				scope: {
					node: '=',
					rootNode: '=',
					shared: '=',
					getParentMetadata: '&'
				},
				templateUrl: sysConfig.src('core/parts/filters/userFilterNode.tpl.html'),
				controller: ['$scope', function($scope) {
					var propertyTypeNode = $scope.node !== $scope.rootNode ?
						$filterHelpers.ensurePropertyTypeNode($scope.node) : null;
					var propertyValueNode = $scope.node !== $scope.rootNode ?
						$filterHelpers.ensurePropertyValueNode($scope.node) : null;

					angular.extend($scope, {
						editMode: null,
						pathDisplayName: null,
						opDisplayName: null,
						valueDisplayName: null,
						propertyTypeNode: propertyTypeNode,
						propertyValueNode: propertyValueNode,

						getMetadata: function(forceRefresh) {
							if(forceRefresh || !$scope.metadata) {
								$scope.metadata = $filterHelpers.getNodeMetadata(
									$scope.node, $scope.getParentMetadata());
							}

							return $scope.metadata;
						},

						getPropertyValueMetadata: function(forceRefresh) {
							if(forceRefresh || !$scope.propertyValueMetadata) {
								$scope.propertyValueMetadata = $filterHelpers.getNodeMetadata(
									$scope.propertyValueNode, $scope.getMetadata());
							}
							return $scope.propertyValueMetadata;
						},

						selectNode: function(node) {
							$scope.shared.selectedNode = node;
						},

						commitEdit: function(changedNode) {
							if($scope.editMode === 'edit') {
								var changedPropertyTypeNode = $filterHelpers.ensurePropertyTypeNode(changedNode);
								var changedPropertyValueNode = $filterHelpers.ensurePropertyValueNode(changedNode);

								if($scope.propertyTypeNode.value !== changedPropertyTypeNode.value) {
									$scope.pathDisplayName = null;
								}

								angular.extend($scope.propertyTypeNode, changedPropertyTypeNode);
								angular.extend($scope.propertyValueNode, changedPropertyValueNode);
								$scope.selectNode($scope.node);

							}
							else if($scope.editMode === 'new') {
								$scope.node.items.push(changedNode);
								$scope.selectNode(changedNode);
							}

							$scope.editMode = null;
						},

						cancelEdit: function() {
							$scope.editMode = null;
						}
					});

					$scope.$watch('propertyTypeNode.value', function(value) {
						if(value && $scope.propertyTypeNode && !$scope.pathDisplayName) {
							$dictionaryService.getCustomPropertyType(value)
							.then(function (result) {
								$scope.pathDisplayName = result.Name;
							});
						}
					}, true);

					$scope.$watch('propertyValueNode.path', function() {
						if(!$scope.propertyValueNode) {
							return;
						}
						$scope.getPropertyValueMetadata(true);
					}, true);

					$scope.$watch('propertyValueNode.op', function(value) {
						if(!$scope.propertyValueNode) {
							return;
						}
						$scope.opDisplayName = $filterHelpers.opDisplayName(
							value, $scope.propertyValueNode.not, $scope.propertyValueNode.path);
					}, true);

					$scope.$watch('propertyValueNode.not', function(value) {
						if(!$scope.propertyValueNode) {
							return;
						}
						$scope.opDisplayName = $filterHelpers.opDisplayName(
							$scope.propertyValueNode.op, value, $scope.propertyValueNode.path);
					}, true);

					$scope.$watch('propertyValueNode.value', function(value) {
						if(!$scope.propertyValueNode) {
							return;
						}
						$scope.valueDisplayName = $filterHelpers.valueDisplayName(
							value, $scope.getPropertyValueMetadata());
					}, true);

					$scope.$watch('shared.selectedNode', function(value) {
						$scope.nodeDataClass = {
							nodeData: true,
							selectedNodeData: value === $scope.node
						};
					});

					$scope.$on('newNode', function() {
						if($scope.node === $scope.rootNode) {
							$scope.editMode = 'new';
							$scope.editingNode = {
								op: '||',
								items: [ ]
							};
							$filterHelpers.ensurePropertyValueNode($scope.editingNode);
						}
					});

					$scope.$on('editNode', function() {
						if($scope.node === $scope.shared.selectedNode) {
							$scope.editMode = 'edit';

							var propertyTypeNode = $filterHelpers.ensurePropertyTypeNode($scope.node);
							var propertyValueNode = $filterHelpers.ensurePropertyValueNode($scope.node);
							$scope.editingNode = {
								op: '||',
								items: [
									angular.extend({ }, propertyTypeNode),
									angular.extend({ }, propertyValueNode)
								]
							};
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
							'<div user-filter-node-editor',
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

					if($scope.node !== $scope.rootNode) {
						return;
					}

					$scope.$watch('node.items', function(value) {
						var container = angular.element(angular.element(element.children()[2]).children()[0]);
						container.html('');

						if(!value || !value.length) {
							return;
						}

						var template = angular.element([
							'<div user-filter-node',
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
				}
			};
		}])
	.directive('userFilterNodeEditor', ['sysConfig', 'filterHelpers', '$filter', 'dictionaryService',
		function(sysConfig, $filterHelpers, $filter, $dictionaryService) {
			return {
				replace: true,
				templateUrl: sysConfig.src('core/parts/filters/userFilterNodeEditor.tpl.html'),
				scope: {
					node: '=',
					shared: '=',
					getParentMetadata: '&',
					commitEdit: '&',
					cancelEdit: '&'
				},
				controller: ['$scope', function($scope) {
					var propertyTypeNode = $filterHelpers.ensurePropertyTypeNode($scope.node);
					var propertyValueNode = $filterHelpers.ensurePropertyValueNode($scope.node);

					angular.extend($scope, {
						ops: [],
						opSelectVisible: false,
						valueEditorUrl: null,
						propertyTypeNode: propertyTypeNode,
						propertyValueNode: propertyValueNode,
						tempNode: {
							path: {
								id: propertyTypeNode.value,
								text: ''
							},
							value: propertyValueNode.value
						},

						propertyTypeSelectOptions: {
							query: function (query) {
								$scope.$apply(function() {
									$dictionaryService.lookupCustomPropertyTypes({
										term: query.term,
										page: query.page - 1
									})
									.then(function (result) {
										var processed = [];

										for(var i = 0; i < result.rows.length; i++) {
											processed.push({
												id: result.rows[i].Id,
												text: result.rows[i].FullName,
												valueType: result.rows[i].ValueType
											});
										}

										query.callback({
											results: processed,
											more: result.rows.length === $dictionaryService.pageSize
										});
									}, function(reason) {
										query.callback({
											results: [ { id: '', text: reason } ],
											more: false
										});
									});
								});
							}
						},

						getMetadata: function(forceRefresh) {
							if(forceRefresh || !$scope.metadata) {
								$scope.metadata = $filterHelpers.getNodeMetadata(
									$scope.propertyValueNode, $scope.getParentMetadata());
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

					$scope.$watch('propertyTypeNode.value', function (value) {
						if(value) {
							$dictionaryService.getCustomPropertyType(value)
							.then(function (result) {
								$scope.tempNode.path = {
									id: value,
									text: result.Name,
									valueType: result.ValueType
								};
							});
						}
					}, true);

					$scope.$watch('propertyValueNode.path', function (value, oldValue) {
						if (oldValue && oldValue !== value) {
							$scope.propertyValueNode.op = '';
							$scope.propertyValueNode.value = '';
						}

						$scope.ops = $filter('applicableOps')($filterHelpers.allOps(), $scope.getMetadata(true));
						if(!$scope.propertyValueNode.op && $scope.ops.length) {
							$scope.propertyValueNode.op = $scope.ops[0];
						}
						for (i = 0; i < $scope.ops.length; i++) {
							$scope.ops[i] = {
								value: $scope.ops[i],
								label: $filterHelpers.opDisplayName($scope.ops[i])
							};
						}

						$scope.opSelectVisible = value && !$filterHelpers.isCompositeNode(
							$scope.propertyValueNode, $scope.getMetadata());
					}, true);

					$scope.$watch('propertyValueNode.op', function (value) {
						$scope.valueEditorUrl = null;
						var metadata = $scope.getMetadata();
						if(!value || !metadata.PropertyType || $filterHelpers.isUnaryNode($scope.propertyValueNode)) {
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

					$scope.$watch('propertyValueNode.value', function (value, oldValue) {
						if(value === oldValue) {
							return;
						}
						$scope.tempNode.value = value;
					}, true);

					$scope.$watch('tempNode.path', function (value) {
						if(value) {
							$scope.propertyTypeNode.value = value.id;
							if(value.valueType) {
								$scope.propertyValueNode.path = value.valueType + 'Value';
							}
						}
					}, true);

					$scope.$watch('tempNode.value', function (value, oldValue) {
						if(value === oldValue) {
							return;
						}
						$scope.propertyValueNode.value = value;
					}, true);

					$filterHelpers.beforeNodeEdit($scope.propertyValueNode);
					$scope.resetValidationErrors();
				}],
				link: function($scope) {
					angular.extend($scope, {
						onSaveEditor: function () {
							var node = angular.extend({ }, $scope.propertyValueNode);
							var metadata = $scope.getMetadata();

							$filterHelpers.afterNodeEdit(node, metadata);
							$scope.resetValidationErrors();
							if(!$scope.propertyTypeNode.path) {
								$scope.validationErrors.path.push('Не указан тип свойства');
								return;
							}
							if (!$filterHelpers.validateNode(node, metadata, $scope.validationErrors)) {
								return;
							}

							angular.extend($scope.propertyValueNode, node);
							$scope.commitEdit({ changedNode: $scope.node });
						},

						onCancelEditor: function () {
							$scope.cancelEdit();
						}
					});
				}
			};
		}
	]);