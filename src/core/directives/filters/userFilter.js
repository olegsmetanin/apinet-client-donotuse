define([
	'../../moduleDef',
	'angular',
	'text!./userFilter.tpl.html',
	'text!./userFilterNode.tpl.html',
	'text!./booleanValueEditor.tpl.html',
	'text!./dateValueEditor.tpl.html',
	'text!./textValueEditor.tpl.html'
], function (module, angular, tpl, nodeTpl, booleanEditorTpl, dateEditorTpl, textEditorTpl) {

	var editorTpls = { };
	module.directive('userFilter', ['$compile', function($compile) {
		angular.extend(editorTpls, {
			boolean: $compile(booleanEditorTpl),
			date: $compile(dateEditorTpl),
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

					addNode: function() {
						$scope.rootNode.items.push({ op: '&&', items: [ ] });
					},

					clear: function() {
						$scope.rootNode.items = [ ];
					},

					decorateRootNode: function() {
						$scope.rootNode.op = '&&';
						delete $scope.rootNode.path;
						delete $scope.rootNode.value;
						delete $scope.rootNode.not;
						$scope.rootNode.items = $scope.rootNode.items || [ ];
					}
				});

				$scope.$watch('rootNode', function(value) {
					if(!value) {
						$scope.rootNode = { };
					}
					$scope.decorateRootNode();
				}, true);
			}]
		};
	}
])
.directive('userFilterNode', ['$filter', 'filteringService', 'metadataService', 'apinetService', '$stateParams',
	function($filter, $filteringService, metadataService, apinetService, $stateParams) {
		return {
			replace: true,
			scope: {
				node: '=',
				rootNode: '='
			},
			template: nodeTpl,
			controller: ['$scope', '$rootScope', function($scope, $rootScope) {
				$scope.typeNode = $filteringService.ensurePropertyTypeNode($scope.node);
				$scope.valueNode = $filteringService.ensurePropertyValueNode($scope.node);
				$scope.editingTypeNode = angular.extend({ }, $scope.typeNode);
				$scope.editingValueNode = angular.extend({ }, $scope.valueNode);

				angular.extend($scope, {
					i18n: $rootScope.i18n,
					context: { },

					typeNodeUpdated: function() {
						if($scope.editingTypeNode.value && !angular.isObject($scope.editingTypeNode.value)) {
							return;
						}

						$scope.getTypeMetadata(function(typeMetadata) {
							var ctx = $scope.context = {
								typeValidation: {
									path: [],
									op: [],
									value: [],
									valid: true
								},
								valueValidation: {
									path: [],
									op: [],
									value: [],
									valid: true
								},
								path: {
									visible: true
								},
								op: {
									visible: false
								},
								value: {
									visible: false,
									editorType: 'text'
								}
							};

							if ($filteringService.validateNode($scope.editingTypeNode, typeMetadata, ctx.typeValidation)) {
								$scope.typeNode = $scope.node.items[0] = angular.extend({ }, $scope.editingTypeNode);
								if(angular.isObject($scope.typeNode.value)) {
									$scope.typeNode.value = $scope.typeNode.value.id;
								}
							}

							$scope.editingValueNode.path = undefined;
							$scope.editingValueNode.op = undefined;
							$scope.editingValueNode.value = undefined;
							$scope.tempValue = undefined;

							if(!$scope.editingTypeNode.value || !$scope.editingTypeNode.value.id) {
								return;
							}

							apinetService.getModel({
								method: 'core/dictionary/getCustomPropertyType',
								project: $stateParams.project,//needs refactoring - must be provided for directive from out (artem1 2014-03-16)
								id: $scope.editingTypeNode.value.id
							}, function(result) {
								if(!result || !result.ValueType) {
									return;
								}

								$scope.nodeUpdated('path', result.ValueType + 'Value');
							});
						});
					},

					nodeUpdated: function(property, value) {
						var forceMetadata = false;
						if(property && $scope.context.hasOwnProperty(property)) {
							$scope.editingValueNode[property] = value;

							if(property === 'path') {
								delete $scope.context.op.options;
								$scope.editingValueNode.op = '';
								forceMetadata = true;
							}
						}

						$scope.getValueMetadata(function(valueMetadata) {
							$filteringService.afterNodeEdit($scope.editingValueNode, valueMetadata);

							var ctx = $scope.context;
							var i;
							if(!ctx.op.options || !ctx.op.options.length) {
								ctx.op.options = $filter('applicableOps')($filteringService.allOps(), valueMetadata);
								if(!$scope.editingValueNode.op && ctx.op.options.length) {
									$scope.editingValueNode.op = ctx.op.options[0];
								}
								for (i = 0; i < ctx.op.options.length; i++) {
									ctx.op.options[i] = {
										value: ctx.op.options[i],
										label: $filteringService.opDisplayName(ctx.op.options[i])
									};
								}
							}


							ctx.value.editorType = 'text';
							if(valueMetadata.PropertyType) {
								ctx.op.visible = true;
								ctx.value.visible = !$filteringService.isUnaryNode($scope.editingValueNode);
								if (valueMetadata.PropertyType === 'date' || valueMetadata.PropertyType === 'datetime' ||
										valueMetadata.PropertyType === 'boolean' || valueMetadata.PropertyType === 'enum') {
									ctx.value.editorType = valueMetadata.PropertyType;
								}
							}

							if ($filteringService.validateNode($scope.editingValueNode, valueMetadata, ctx.validation)) {
								$scope.valueNode = $scope.node.items[1] = angular.extend({ }, $scope.editingValueNode);
							}
							$filteringService.beforeNodeEdit($scope.editingValueNode);

							ctx.op.displayValue = $filteringService.opDisplayName(
								$scope.editingValueNode.op, $scope.editingValueNode.not, $scope.node.path);
							ctx.value.displayValue = $filteringService.valueDisplayName(
								$scope.editingValueNode.value, valueMetadata);

						}, forceMetadata);
					},

					getTypeMetadata: function(callback) {
						if(!$scope.typeMetadata) {
							metadataService.modelMetadata('core/dictionary/customPropertyMetadata',
								'AGO.Core.Model.Dictionary.CustomPropertyTypeModel', function(typeMetadata) {
									$scope.typeMetadata = typeMetadata;
									callback($scope.typeMetadata);
								});
							return;
						}
						callback($scope.typeMetadata);
					},

					getValueMetadata: function(callback, forceRefresh) {
						if(forceRefresh || !$scope.valueMetadata) {
							metadataService.modelMetadata('core/dictionary/customPropertyMetadata',
								'AGO.Core.Model.Dictionary.CustomPropertyInstanceModel', function(parentMeta) {
									$filteringService.getNodeMetadata('core/dictionary/customPropertyMetadata',
										$scope.editingValueNode, parentMeta, function(typeMetadata) {
											$scope.valueMetadata = typeMetadata;
											callback($scope.valueMetadata);
										});
								});
							return;
						}
						callback($scope.valueMetadata);
					},

					deleteNode: function() {
						var index = $scope.rootNode.items.indexOf($scope.node);
						if(index === -1) {
							return;
						}
						$scope.rootNode.items.splice(index, 1);
					}
				});

				$scope.$watch('editingTypeNode.value', $scope.typeNodeUpdated, true);
			}]
		};
	}]);
});