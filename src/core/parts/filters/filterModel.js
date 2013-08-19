/* global angular: true */
angular.module('core')
	.service('filterHelpers', ['helpers', function($helpers) {
		angular.extend(this, {
			createNewNode: function() {
				return {
					path: '',
					op: '&&',
					value: '',
					items: [ ]
				};
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

				return node.op === '||' || node.op === '&&' || node.op === '&&!' ||
					node.path === '||' || node.path === '&&' || node.path === '&&!';

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

				var metadata = nodeMeta ? nodeMeta : { };

				if(path && parentMeta && parentMeta.PrimitiveProperties && parentMeta.PrimitiveProperties[path]) {
					metadata = parentMeta.PrimitiveProperties[path];
				}
				if(path && parentMeta && parentMeta.ModelProperties && parentMeta.ModelProperties[path]) {
					metadata = parentMeta.ModelProperties[path];
				}

				return metadata && metadata.DisplayName ? metadata.DisplayName : path;
			},

			opDisplayName: function (op, not) {
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
					return 'ИЛИ';
				}
				if (op === '&&' || op === '&&!') {
					return not || op === '&&!' ? 'И НЕ' : 'И';
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

				if (node.path && node.op) {
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
			}
		});
	}])
	.service('metadataService', [ function() {
		var allMetadata = {
			'AGO.Docstore.Model.Projects.ProjectParticipantModel': {
				'PrimitiveProperties': {
					'GroupName': {
						'DisplayName': 'Группа',
						'PropertyType': 'string'
					},
					'IsDefaultGroup': {
						'DisplayName': 'Группа по умолчанию',
						'PropertyType': 'boolean'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Project': {
						'DisplayName': 'Проект',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Projects.ProjectModel'
					},
					'User': {
						'DisplayName': 'Пользователь',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Documents.DocumentCustomPropertyModel': {
				'PrimitiveProperties': {
					'StringValue': {
						'DisplayName': 'Значение-строка',
						'PropertyType': 'string'
					},
					'NumberValue': {
						'DisplayName': 'Значение-число',
						'PropertyType': 'float'
					},
					'DateValue': {
						'DisplayName': 'Значение-дата',
						'PropertyType': 'date'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'PropertyType': {
						'DisplayName': 'Тип параметра',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Dictionary.CustomPropertyTypeModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'Document': {
						'DisplayName': 'Документ',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Documents.DocumentModel'
					}
				}
			},
			'AGO.Docstore.Model.Dictionary.CustomPropertyInstanceModel': {
				'PrimitiveProperties': {
					'StringValue': {
						'DisplayName': 'Значение-строка',
						'PropertyType': 'string'
					},
					'NumberValue': {
						'DisplayName': 'Значение-число',
						'PropertyType': 'float'
					},
					'DateValue': {
						'DisplayName': 'Значение-дата',
						'PropertyType': 'date'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'PropertyType': {
						'DisplayName': 'Тип параметра',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Dictionary.CustomPropertyTypeModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Dictionary.CustomPropertyTypeModel': {
				'PrimitiveProperties': {
					'ProjectCode': {
						'DisplayName': 'Код проекта',
						'PropertyType': 'string'
					},
					'Name': {
						'DisplayName': 'Наименование',
						'PropertyType': 'string'
					},
					'FullName': {
						'DisplayName': 'Полное наименование',
						'PropertyType': 'string'
					},
					'Format': {
						'DisplayName': 'Формат',
						'PropertyType': 'string'
					},
					'ValueType': {
						'DisplayName': 'Тип значения',
						'PropertyType': 'enum',
						'PossibleValues': {
							'String': 'Строка',
							'Number': 'Число',
							'Date': 'Дата'
						}
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Children': {
						'DisplayName': 'Последователи',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Dictionary.CustomPropertyTypeModel'
					},
					'Parent': {
						'DisplayName': 'Предшественник',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Dictionary.CustomPropertyTypeModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Dictionary.Documents.DocumentAddresseeModel': {
				'PrimitiveProperties': {
					'ProjectCode': {
						'DisplayName': 'Код проекта',
						'PropertyType': 'string'
					},
					'Name': {
						'DisplayName': 'Наименование',
						'PropertyType': 'string'
					},
					'FullName': {
						'DisplayName': 'Полное наименование',
						'PropertyType': 'string'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Children': {
						'DisplayName': 'Последователи',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Dictionary.Documents.DocumentAddresseeModel'
					},
					'ReceivingDocuments': {
						'DisplayName': 'Документы (кому)',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Documents.DocumentModel'
					},
					'Parent': {
						'DisplayName': 'Предшественник',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Dictionary.Documents.DocumentAddresseeModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Dictionary.Documents.DocumentCategoryModel': {
				'PrimitiveProperties': {
					'ProjectCode': {
						'DisplayName': 'Код проекта',
						'PropertyType': 'string'
					},
					'Name': {
						'DisplayName': 'Наименование',
						'PropertyType': 'string'
					},
					'FullName': {
						'DisplayName': 'Полное наименование',
						'PropertyType': 'string'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Children': {
						'DisplayName': 'Последователи',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Dictionary.Documents.DocumentCategoryModel'
					},
					'Documents': {
						'DisplayName': 'Документы',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Documents.DocumentModel'
					},
					'Parent': {
						'DisplayName': 'Предшественник',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Dictionary.Documents.DocumentCategoryModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Dictionary.Documents.DocumentStatusModel': {
				'PrimitiveProperties': {
					'ProjectCode': {
						'DisplayName': 'Код проекта',
						'PropertyType': 'string'
					},
					'Name': {
						'DisplayName': 'Наименование',
						'PropertyType': 'string'
					},
					'Description': {
						'DisplayName': 'Описание',
						'PropertyType': 'string'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Dictionary.OrgStructure.DepartmentModel': {
				'PrimitiveProperties': {
					'ProjectCode': {
						'DisplayName': 'Код проекта',
						'PropertyType': 'string'
					},
					'Name': {
						'DisplayName': 'Наименование',
						'PropertyType': 'string'
					},
					'FullName': {
						'DisplayName': 'Полное наименование',
						'PropertyType': 'string'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Users': {
						'DisplayName': 'Пользователи',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'Children': {
						'DisplayName': 'Последователи',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Dictionary.OrgStructure.DepartmentModel'
					},
					'Parent': {
						'DisplayName': 'Предшественник',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Dictionary.OrgStructure.DepartmentModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Dictionary.Projects.ProjectStatusModel': {
				'PrimitiveProperties': {
					'ProjectCode': {
						'DisplayName': 'Код проекта',
						'PropertyType': 'string'
					},
					'Name': {
						'DisplayName': 'Наименование',
						'PropertyType': 'string'
					},
					'Description': {
						'DisplayName': 'Описание',
						'PropertyType': 'string'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Documents.DocumentCommentModel': {
				'PrimitiveProperties': {
					'ExternalAuthor': {
						'DisplayName': 'Автор - внешний пользователь',
						'PropertyType': 'string'
					},
					'Text': {
						'DisplayName': 'Текст',
						'PropertyType': 'string'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Document': {
						'DisplayName': 'Документ',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Documents.DocumentModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Documents.DocumentModel': {
				'PrimitiveProperties': {
					'SeqNumber': {
						'DisplayName': 'Номер п/п',
						'PropertyType': 'string'
					},
					'DocumentType': {
						'DisplayName': 'Тип документа',
						'PropertyType': 'enum',
						'PossibleValues': {
							'Incoming': 'Входящие',
							'Outgoing': 'Исходящие',
							'Internal': 'Внутренние'
						}
					},
					'Annotation': {
						'DisplayName': 'Краткое содержание',
						'PropertyType': 'string'
					},
					'Content': {
						'DisplayName': 'Содержание',
						'PropertyType': 'string'
					},
					'Date': {
						'DisplayName': 'Дата документа',
						'PropertyType': 'date'
					},
					'Number': {
						'DisplayName': 'Номер документа',
						'PropertyType': 'string'
					},
					'SourceDocUrl': {
						'DisplayName': 'Url исходного документа',
						'PropertyType': 'string'
					},
					'SourceDocDate': {
						'DisplayName': 'Дата исходного документа',
						'PropertyType': 'date'
					},
					'SourceDocNumber': {
						'DisplayName': 'Номер исходного документа',
						'PropertyType': 'string'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'StatusHistory': {
						'DisplayName': 'История статусов документа',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Documents.DocumentStatusHistoryModel'
					},
					'Categories': {
						'DisplayName': 'Категории документов',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Dictionary.Documents.DocumentCategoryModel'
					},
					'Comments': {
						'DisplayName': 'Комментарии',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Documents.DocumentCommentModel'
					},
					'Receivers': {
						'DisplayName': 'Адресаты (кому)',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Dictionary.Documents.DocumentAddresseeModel'
					},
					'CustomProperties': {
						'DisplayName': 'Параметры',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Documents.DocumentCustomPropertyModel'
					},
					'Status': {
						'DisplayName': 'Статус',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Dictionary.Documents.DocumentStatusModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Documents.DocumentStatusHistoryModel': {
				'PrimitiveProperties': {
					'StartDate': {
						'DisplayName': 'Дата начала',
						'PropertyType': 'date'
					},
					'EndDate': {
						'DisplayName': 'Дата конца',
						'PropertyType': 'date'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Document': {
						'DisplayName': 'Документ',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Documents.DocumentModel'
					},
					'Status': {
						'DisplayName': 'Статус',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Dictionary.Documents.DocumentStatusModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Projects.ProjectModel': {
				'PrimitiveProperties': {
					'ProjectCode': {
						'DisplayName': 'Код проекта',
						'PropertyType': 'string'
					},
					'Name': {
						'DisplayName': 'Наименование',
						'PropertyType': 'string'
					},
					'Description': {
						'DisplayName': 'Описание',
						'PropertyType': 'string'
					},
					'IsArchive': {
						'DisplayName': 'Архив',
						'PropertyType': 'boolean'
					},
					'EventsHorizon': {
						'DisplayName': 'Горизонт событий проекта',
						'PropertyType': 'date'
					},
					'FileSystemPath': {
						'DisplayName': 'Путь к проекту',
						'PropertyType': 'string'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'StatusHistory': {
						'DisplayName': 'История статусов учета',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Projects.ProjectStatusHistoryModel'
					},
					'Participants': {
						'DisplayName': 'Участники проекта',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Projects.ProjectParticipantModel'
					},
					'Status': {
						'DisplayName': 'Статус проекта',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Dictionary.Projects.ProjectStatusModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Projects.ProjectStatusHistoryModel': {
				'PrimitiveProperties': {
					'StartDate': {
						'DisplayName': 'Дата начала',
						'PropertyType': 'date'
					},
					'EndDate': {
						'DisplayName': 'Дата конца',
						'PropertyType': 'date'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Project': {
						'DisplayName': 'Документ',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Projects.ProjectModel'
					},
					'Status': {
						'DisplayName': 'Статус',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Dictionary.Projects.ProjectStatusModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Security.UserGroupModel': {
				'PrimitiveProperties': {
					'Name': {
						'DisplayName': 'Наименование',
						'PropertyType': 'string'
					},
					'Description': {
						'DisplayName': 'Описание',
						'PropertyType': 'string'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Users': {
						'DisplayName': 'Пользователи',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			},
			'AGO.Docstore.Model.Security.UserModel': {
				'PrimitiveProperties': {
					'Login': {
						'DisplayName': 'Логин',
						'PropertyType': 'string'
					},
					'PwdHash': {
						'DisplayName': 'MD5 хеш для авторизации в WebDav',
						'PropertyType': 'string'
					},
					'Active': {
						'DisplayName': 'Активен',
						'PropertyType': 'boolean'
					},
					'Name': {
						'DisplayName': 'Имя',
						'PropertyType': 'string'
					},
					'LastName': {
						'DisplayName': 'Фамилия',
						'PropertyType': 'string'
					},
					'MiddleName': {
						'DisplayName': 'Отчество',
						'PropertyType': 'string'
					},
					'FIO': {
						'DisplayName': 'ФИО',
						'PropertyType': 'string'
					},
					'WhomFIO': {
						'DisplayName': 'Фамилия с инициалами (родительный)',
						'PropertyType': 'string'
					},
					'JobName': {
						'DisplayName': 'Краткое наименование должности (именительный)',
						'PropertyType': 'string'
					},
					'WhomJobName': {
						'DisplayName': 'Краткое наименование должности (родительный)',
						'PropertyType': 'string'
					},
					'LastChangeTime': {
						'DisplayName': 'Когда последний раз редактировали',
						'PropertyType': 'date'
					},
					'CreationTime': {
						'DisplayName': 'Дата создания',
						'PropertyType': 'datetime'
					},
					'Id': {
						'DisplayName': 'Идентификатор',
						'PropertyType': 'guid'
					}
				},
				'ModelProperties': {
					'Departments': {
						'DisplayName': 'Подразделения',
						'IsCollection': true,
						'ModelType': 'AGO.Docstore.Model.Dictionary.OrgStructure.DepartmentModel'
					},
					'Group': {
						'DisplayName': 'Группа',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserGroupModel'
					},
					'Creator': {
						'DisplayName': 'Кто создал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					},
					'LastChanger': {
						'DisplayName': 'Кто последний раз редактировал',
						'IsCollection': false,
						'ModelType': 'AGO.Docstore.Model.Security.UserModel'
					}
				}
			}
		};

		angular.extend(this, {
			modelMetadata: function (modelType) {
				return modelType && allMetadata[modelType] ? allMetadata[modelType] : { };
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
	}])
	.directive('filterModel', ['helpers', 'filterHelpers',
		function($helpers, $filterHelpers) {
			return {
				scope: {
					rootNode: '=',
					modelType: '='
				},

				controller: ['$scope', function($scope) {
					function findNodePosition(node, parent) {
						var index, subResult, i;

						if(node && parent && parent.items) {
							index = parent.items.indexOf(node);
							if(index !== -1) {
								return {
									parent: parent,
									index: index
								};
							}

							for(i = 0; i < parent.items.length; i++) {
								subResult = findNodePosition(node, parent.items[i]);
								if(subResult){
									return subResult;
								}
							}
						}

						return null;
					}

					function afterNodeEdit(node, metadata) {
						if ($filterHelpers.isSpecialNode(node)) {
							node.path = '';
							node.value = '';
						}
						else if ($filterHelpers.isCompositeNode(node, metadata)) {
							node.op = '';
							node.value = '';
						}
						else {
							node.items = [];
						}

						if ($filterHelpers.isUnaryNode(node)) {
							node.value = '';
						}

						return node;
					}

					$scope.$on('clear', function() {
						$scope.rootNode = null;
					});

					$scope.$on('addNode', function(e, args) {
						var node = args.node, parent = args.parent, newNode;
						if(!node || !parent || !$filterHelpers.isCompositeNode(parent, args.parentMetadata)) {
							return;
						}

						newNode = afterNodeEdit(node, args.metadata);
						if(!$filterHelpers.validateNode(newNode, args.metadata)) {
							return;
						}

						parent.items.push(newNode);
					});

					$scope.$on('updateNode', function(e, args) {
						var node = args.node, changedNode = args.changedNode;
						if(!node || !changedNode) {
							return;
						}

						changedNode = afterNodeEdit(changedNode, args.metadata);
						if(!$filterHelpers.validateNode(changedNode, args.metadata)) {
							return;
						}

						angular.extend(node, changedNode);
					});

					$scope.$on('deleteNode', function(e, args) {
						var position = findNodePosition(args.node, $scope.rootNode);
						if(!position) {
							return;
						}

						position.parent.items.splice(position.index, 1);
					});

					$scope.$watch('rootNode', function(newValue) {
						if(!newValue) {
							$scope.rootNode = $filterHelpers.createNewNode();
						}
					});
				}]
			};
		}
	]);