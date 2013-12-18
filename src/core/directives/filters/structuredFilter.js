define([
	'../../moduleDef',
	'jquery',
	'angular',
	'text!./structuredFilter.tpl.html',
	'text!./structuredFilterNode.tpl.html',
	'text!./booleanValueEditor.tpl.html',
	'text!./datetimeValueEditor.tpl.html',
	'text!./dateValueEditor.tpl.html',
	'text!./enumValueEditor.tpl.html',
	'text!./textValueEditor.tpl.html'
], function (module, $, angular, tpl, nodeTpl, booleanEditorTpl, datetimeEditorTpl,	dateEditorTpl, enumEditorTpl, textEditorTpl) {
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
							$scope.rootNode = { op: '&&', items: [ ] };
							$scope.clear();
						}
					}, true);
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
					$scope.node = $scope.node || { op: '&&', items: [ ] };
					$scope.editingNode = angular.extend({ }, $scope.node);

					angular.extend($scope, {
						i18n: $rootScope.i18n,
						context: { },

						nodeUpdated: function(property, value) {
							var forceMetadata = false;
							if(property && $scope.context.hasOwnProperty(property)) {
								$scope.editingNode[property] = value;

								if(property === 'path') {
									delete $scope.context.op.options;
									$scope.editingNode.op = '';
									forceMetadata = true;
								}
							}

							var ctx = $scope.context = {
								add: $scope.root,
								delete: !$scope.root,
								hover: false,
								validation: {
									path: [],
									op: [],
									value: [],
									valid: true
								},
								path: {
									editable: false,
									visible: true
								},
								op: {
									editable: false,
									visible: false
								},
								value: {
									editable: false,
									visible: false,
									editorType: null
								}
							};

							if($scope.root) {
								return;
							}

							$scope.getMetadata(function() {
								$filteringService.afterNodeEdit($scope.editingNode, ctx.metadata);

								var i;
								if(!ctx.op.options || !ctx.op.options.length) {
									ctx.op.options = $filter('applicableOps')($filteringService.allOps(), ctx.metadata);
									if(!$scope.editingNode.op && ctx.op.options.length) {
										$scope.editingNode.op = ctx.op.options[0];
									}
									for (i = 0; i < ctx.op.options.length; i++) {
										ctx.op.options[i] = {
											value: ctx.op.options[i],
											label: $filteringService.opDisplayName(ctx.op.options[i])
										};
									}
								}

								if(!ctx.path.options || !ctx.path.options.length) {
									ctx.path.options = $filteringService.applicablePaths(ctx.parentMeta);

									for(i = 0; i < ctx.path.options.length; i++) {
										ctx.path.options[i] = {
											value: ctx.path.options[i],
											label: $filteringService.pathDisplayName(ctx.path.options[i], ctx.parentMeta)
										};
									}

									ctx.path.options.sort(function(a, b) {
										if(a.value === '&&' || a.value === '||' || a.value === '&&!') {
											return -1;
										}
										if(b.value === '&&' || b.value === '||' || b.value === '&&!') {
											return 1;
										}
										if (a.label > b.label) {
											return 1;
										}
										if (a.label < b.label) {
											return -1;
										}
										return 0;
									});
								}

								var composite = $filteringService.isCompositeNode($scope.editingNode, ctx.metadata);
								var special = $filteringService.isSpecialNode($scope.editingNode);

								if(composite || special) {
									ctx.add = true;
									ctx.path.editable = !$scope.editingNode.items || !$scope.editingNode.items.length;
								}
								else {
									ctx.path.editable = true;
									ctx.op.editable = ctx.op.visible = !!$scope.editingNode.path;

									ctx.value.editable = ctx.value.visible = !!$scope.editingNode.path &&
										!!$scope.editingNode.op && !$filteringService.isUnaryNode($scope.editingNode);
									if(ctx.value.editable) {
										ctx.value.editorType = 'text';

										if (ctx.metadata.PropertyType === 'date' || ctx.metadata.PropertyType === 'datetime' ||
												ctx.metadata.PropertyType === 'boolean' || ctx.metadata.PropertyType === 'enum') {
											ctx.value.editorType = ctx.metadata.PropertyType;
										}
									}
								}

								if ($filteringService.validateNode($scope.editingNode, ctx.metadata, ctx.validation)) {
									$scope.node = angular.extend({ }, $scope.editingNode);
								}
								$filteringService.beforeNodeEdit($scope.editingNode);

								ctx.path.displayValue = $filteringService.pathDisplayName(
									$scope.editingNode.path, ctx.parentMeta, ctx.metadata);
								ctx.op.displayValue = $filteringService.opDisplayName(
									$scope.editingNode.op, $scope.editingNode.not, $scope.node.path);
								ctx.value.displayValue = $filteringService.valueDisplayName(
									$scope.editingNode.value, ctx.metadata);

							}, forceMetadata);

							if(property) {
								$scope.$parent.nodeUpdated();
							}
						},

						getMetadata: function(callback, forceRefresh) {
							if(forceRefresh || !$scope.context.metadata) {
								$scope.getParentMetadata({
									callback: function(parentMeta) {
										$filteringService.getNodeMetadata($scope.meta, $scope.editingNode, parentMeta, function(metadata) {
											$scope.context.metadata = metadata;
											$scope.context.parentMeta = parentMeta;
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
							$scope.nodeUpdated();
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
							$scope.$parent.nodeUpdated();
						}
					});

					if($scope.root) {
						$scope.$on('addRootNode', function() { $scope.addNode(); });

						$scope.$on('clear', function() {
							$scope.node.items = [];
							$scope.renderSubNodes();
						});
					}

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

						$scope.node = $scope.node || { };
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
			link: function($scope, element, attrs) {
				attrs.$observe('filterValueEditor', function(editorType) {
					var linkFn = editorTpls[editorType];
					if(!linkFn) {
						return;
					}
					linkFn($scope, function(cloned) {
						element.html(cloned);
					});
				});
			}
		};
	}]);
});