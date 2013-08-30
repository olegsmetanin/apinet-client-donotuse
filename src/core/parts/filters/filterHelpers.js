angular.module('core')
	.service('filterHelpers', ['helpers', 'metadataService', function($helpers, $metadataService) {
		angular.extend(this, {
			getNodeMetadata: function(method, node, parentMetadata, callback) {
				var metadata;

				if(!this.isSpecialNode(node)) {
					if (node.path && parentMetadata && parentMetadata.PrimitiveProperties &&
						parentMetadata.PrimitiveProperties[node.path]) {
						metadata = parentMetadata.PrimitiveProperties[node.path];
					}

					if (node.path && parentMetadata && parentMetadata.ModelProperties &&
						parentMetadata.ModelProperties[node.path]) {
						metadata = parentMetadata.ModelProperties[node.path];
					}

					if(metadata && metadata.ModelType &&
							!(metadata.PrimitiveProperties || metadata.ModelProperties)) {
						$metadataService.modelMetadata(method, metadata.ModelType, function(extendedMeta) {
							angular.extend(metadata, extendedMeta);
							callback(metadata);
						});
						return;
					}
				}

				callback(metadata || parentMetadata);
			},

			isUnaryNode: function (node) {
				if (!node) {
					return false;
				}

				return node.op === 'exists' || node.op === 'not exists';
			},

			isSpecialNode: function (node) {
				if (!node) {
					return false;
				}

				return (!node.path && (node.op === '||' || node.op === '&&' || node.op === '&&!')) ||
					(!node.op && (node.path === '||' || node.path === '&&' || node.path === '&&!'));

			},

			isCompositeNode: function (node, metadata) {
				return this.isSpecialNode(node) || (metadata && metadata.ModelType);
			},
			
			allOps: function() {
				return [
					'=',
					'!=',
					'>',
					'<',
					'>=',
					'<=',
					'exists',
					'not exists',
					'like',
					'not like'
				];	
			},

			applicablePaths: function(metadata) {
				var result = [], key;
				if(!metadata) {
					return result;
				}

				result.push('&&');
				result.push('||');
				result.push('&&!');

				for (key in metadata.PrimitiveProperties) {
					if (!metadata.PrimitiveProperties.hasOwnProperty(key)) {
						continue;
					}
					result.push(key);
				}

				for (key in metadata.ModelProperties) {
					if (!metadata.ModelProperties.hasOwnProperty(key)) {
						continue;
					}
					result.push(key);
				}

				return result;
			},

			isOpApplicableToNode: function (op, metadata) {
				if (!metadata) {
					return false;
				}

				if (op === 'exists' || op === 'not exists') {
					return metadata.PropertyType;
				}

				if (op === 'like' || op === 'not like') {
					return metadata.PropertyType === 'string';
				}

				if (op === '=' || op === '!=') {
					return metadata.PropertyType && metadata.PropertyType !==
						'datetime';
				}

				if (op === '>' || op === '<' || op === '>=' || op === '<=') {
					return metadata.PropertyType === 'date' ||
						metadata.PropertyType === 'datetime' ||
						metadata.PropertyType === 'int' ||
						metadata.PropertyType === 'float';
				}

				return false;
			},

			pathDisplayName: function (path, parentMeta, nodeMeta) {
				if (path === '||') {
					return 'ИЛИ';
				}
				if (path === '&&') {
					return 'И';
				}
				if (path === '&&!') {
					return 'И НЕ';
				}

				var metadata = path && nodeMeta ? nodeMeta : { };

				if(path && parentMeta && parentMeta.PrimitiveProperties && parentMeta.PrimitiveProperties[path]) {
					metadata = parentMeta.PrimitiveProperties[path];
				}
				if(path && parentMeta && parentMeta.ModelProperties && parentMeta.ModelProperties[path]) {
					metadata = parentMeta.ModelProperties[path];
				}

				return metadata && metadata.DisplayName ? metadata.DisplayName : path;
			},

			opDisplayName: function (op, not, path) {
				if (op === '=' || op === '!=') {
					return not || op === '!=' ? '!=' : '=';
				}
				if (op === 'exists' || op === 'not exists') {
					return not || op === 'not exists' ? 'НЕ СУЩЕСТВУЕТ' : 'СУЩЕСТВУЕТ';
				}
				if (op === 'like' || op === 'not like') {
					return not || op === 'not like' ? 'НЕ СОДЕРЖИТ' : 'СОДЕРЖИТ';
				}
				if (op === '||') {
					return path ? '' : 'ИЛИ';
				}
				if (op === '&&' || op === '&&!') {
					return path ? '' : (not || op === '&&!' ? 'И НЕ' : 'И');
				}

				return op;
			},

			valueDisplayName: function (value, metadata) {
				var date, localized;

				if (!metadata) {
					return value;
				}

				if (metadata && metadata.PropertyType === 'boolean') {
					value = value === 'true' || value === '1' ?	'Да' : value;
					value = value === 'false' || value === '0' ? 'Нет' : value;
				}
				else if (metadata && metadata.PropertyType === 'date') {
					date = new Date(value);
					value = !isNaN(date.valueOf()) ? $helpers.localDateString(date) : value;
				}
				else if (metadata && metadata.PropertyType === 'datetime') {
					date = new Date(value);
					value = !isNaN(date.valueOf()) ? $helpers.localDateTimeString(date) : value;
				}
				else if (metadata && metadata.PropertyType === 'enum') {
					localized = metadata.PossibleValues ? metadata.PossibleValues[value] : '';
					value = localized.length ? localized : value;
				}

				return value;
			},

			validateNode: function (node, metadata, validationErrors) {
				validationErrors = validationErrors ? validationErrors : {
					path: [],
					op: [],
					value: [],
					valid: true
				};

				if (this.isCompositeNode(node, metadata)) {
					this.validateCompositeNode(node, validationErrors);
				}
				else {
					this.validatePropertyNode(node, metadata, validationErrors);
				}

				validationErrors.valid = !validationErrors.path.length && !validationErrors.op.length &&
					!validationErrors.value.length;


				return validationErrors.valid;
			},

			validateCompositeNode: function (node, validationErrors) {
				if (!this.isSpecialNode(node)) {
					return;
				}

				if (node.path && !(node.op === '&&' || node.op === '||')) {
					validationErrors.path.push('Данное условие не может содержать оператора');
				}

				if (node.path && node.value) {
					validationErrors.path.push('Данное условие не может содержать значения');
				}
			},

			validatePropertyNode: function (node, metadata, validationErrors) {
				var found, possibleValues, key, propertyType;

				if (node.items && node.items.length) {
					validationErrors.path.push('Данное условие не должно содержать вложенных условий');
				}

				if (!node.op) {
					validationErrors.op.push('Не указан оператор');
				}

				if (this.isUnaryNode(node)) {
					return;
				}

				if (!node.value) {
					validationErrors.value.push('Не указано значение');
				}

				propertyType = metadata.PropertyType;

				if (propertyType === 'guid' && !new RegExp(
						'^(\\{){0,1}[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]' +
						'{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}(\\}){0,1}$').test(node.value)) {
					validationErrors.value.push('Значение должно уникальным идентификатором (Guid)');
				}
				if (propertyType === 'int' && isNaN(parseInt(node.value, 10))) {
					validationErrors.value.push('Значение должно быть целочисленным');
				}
				if (propertyType === 'float' && isNaN(parseFloat(node.value))) {
					validationErrors.value.push('Значение должно быть численным');
				}
				if (propertyType === 'bool' && node.value !== 'true' &&	node.value !== 'false') {
					validationErrors.value.push('Значение должно быть "Да" или "Нет"');
				}
				if (propertyType === 'date' || propertyType === 'datetime') {
					if (isNaN((new Date(node.value).valueOf()))) {
						validationErrors.value.push('Значение должно быть валидной датой');
					}
				}
				if (propertyType === 'datetime') {
					if (node.op === '=' || node.op === '!=') {
						validationErrors.value.push('Временная метка не может проверяться ' +
							'на равенство, так как не является дискретной величиной');
					}
				}
				if (propertyType === 'enum') {
					found = false;
					possibleValues = angular.isObject(metadata.PossibleValues) ?	metadata.PossibleValues : {};
					for (key in possibleValues) {
						if (!possibleValues.hasOwnProperty(key)) {
							continue;
						}
						if (node.value === key) {
							found = true;
							break;
						}
					}

					if (!found) {
						validationErrors.value.push('Значение не входит в список допустимых');
					}
				}
			},
			
			beforeNodeEdit: function(node) {
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
			},

			afterNodeEdit: function(node, metadata) {
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

				if (this.isSpecialNode(node)) {
					node.path = '';
					node.value = '';
				}
				else if (this.isCompositeNode(node, metadata)) {
					node.op = '&&';
					node.value = '';
				}
				else {
					node.items = [];
				}

				if (this.isUnaryNode(node)) {
					node.value = '';
				}
			},

			ensurePropertyTypeNode: function(node) {
				if(!node.items) {
					node.items = [];
				}
				if(node.items.length === 0) {
					node.items.push({
						items: []
					});
				}

				var propertyTypeNode = node.items[0];
				propertyTypeNode.path = 'PropertyType';
				propertyTypeNode.op = '=';
				propertyTypeNode.value = propertyTypeNode.value ? propertyTypeNode.value : '';
				return propertyTypeNode;
			},

			ensurePropertyValueNode: function(node) {
				this.ensurePropertyTypeNode(node);
				if(node.items.length <= 1) {
					node.items.push({
						items: []
					});
				}

				return node.items[1];
			}
		});
	}])
	.filter('applicableOps', ['filterHelpers', function($filterHelpers) {
		return function(input, metadata) {
			var result = [], i;
			if(!angular.isArray(input) || !metadata) {
				return result;
			}

			for (i = 0; i < input.length; i++) {
				if($filterHelpers.isOpApplicableToNode(input[i], metadata)) {
					result.push(input[i]);
				}
			}

			return result;
		};
	}]);