angular.module('backend', ['ngMockE2E'])
	.run(['$httpBackend', '$timeout', 'reportService',
		function($httpBackend, $timeout, reportService) {

			var userId = 0;

			var makeUser = function(fname, lname, isAdmin) {
				userId++;
				return {
					id: userId,
					firstName: fname,
					lastName: lname,
					email: fname + '.' + lname + '@abc.com',
					admin: isAdmin
				};
			};

			var admin = makeUser('a', 'admin', true); //admin
			var ivanov = makeUser('ivan', 'ivanov', false); //project manager
			var petrov = makeUser('petr', 'petrov', false); //project executor
			var sidorov = makeUser('sidor', 'sidorov', false); //project executor
			var users = [admin, ivanov, petrov, sidorov];

			var currentUser = admin;


			var projMatrix = {
				play2: {
					admins: [ivanov, admin],
					managers: [ivanov, petrov],
					executors: [sidorov]
				},
				prj2: {
					admins: [ivanov],
					managers: [ivanov],
					executors: [petrov]
				}
			};

			var userGroups = function(proj, userId) {
				var p = projMatrix[proj];
				var groups = [];
				var user = null;
				angular.forEach(users, function(u) {
					if (u.id === userId) {
						user = u;
					}
				});
				for (var group in p) {
					if ($.inArray(user, p[group]) >= 0) {
						groups.push(group);
					}
				}
				return groups;
			};

			//fake login
			$httpBackend.whenPOST('/api/core/auth/login').respond(
				function(method, url, data, headers) {
					var prms = JSON.parse(data);
					//test error on
					if (prms.email === 'bad@abc.com') {
						return [500, 'Oops, something went wrong'];
					}

					var found = null;
					angular.forEach(users, function(u) {
						if (u.email === prms.email && '111' === prms.password) {
							found = angular.copy(u);
						}
					});

					currentUser = found;

					return [200, {
						user: currentUser
					}];
				});

			//fake logout
			$httpBackend.whenPOST('/api/core/auth/logout').respond(function(method, url, data, headers) {
				currentUser = {};
				return [204];
			});

			//fake current-user
			$httpBackend.whenPOST('/api/core/auth/currentUser').respond(function(method, url, data, headers) {
				if (currentUser) {
					return [200, {
						user: currentUser
					}];
				} else {
					return [500, 'Oops, something went wrong'];
				}
			});


			//fake user groups
			$httpBackend.whenPOST('/user-groups').respond(function(method, url, data, headers) {
				console.log("post /user-groups", data);
				var prms = JSON.parse(data);
				return [200, {
					groups: ['admins'] //userGroups(prms.project, prms.userId)
				}];
			});


			$httpBackend.whenPOST('/api/models/').respond(function(method, url, data, headers) {
				var prms = JSON.parse(data);
				if ((prms.action === 'getModels') && (prms.modelType === 'AGO.Core.Model.Projects.ProjectModel')) {
					return getProjects();
				} else {
					return [500, 'Oops, something went wrong'];
				}
			});

			$httpBackend.whenPOST('/api').respond(function(method, url, data, headers) {
				var prms = JSON.parse(data);
				if (prms.action === "getUserReports") {
					return getUserReports();
				} else if (prms.action === "getUnreadUserReports") {
					return getUnreadUserReports();
				} else if (prms.action === "generateReport") {
					return generateReport();
				} else {
					return [500, 'Oops, something went wrong'];
				}
			});

			$httpBackend.whenPOST('/api/home/config/getConfig').respond(function(method, url, data, headers) {
				return [200, {
					user: {
						role: "admin",
						roles: ['admin'],
						permissions: []
					}
				}];
			});

			$httpBackend.whenPOST('/api/home/users/getRole').respond(function(method, url, data, headers) {
				return '';
			});

			$httpBackend.whenPOST('/api/home/users/setRole').respond(function(method, url, data, headers) {
				return [200];
			});

			$httpBackend.whenPOST('/api/docs/documents/getDocuments').respond(function(method, url, data, headers) {
				return [200, {
					rows: [{
						Annotation: "Doc1"
					}, {
						Annotation: "Doc2"
					}]
				}];
			});

			$httpBackend.whenPOST('/api/home/contractCategory/getNames').respond(function(method, url, data, headers) {
				console.log("/api/home/contractCategory/getNames");
				return [200, {
					rows: [{
						id: 1,
						text: "qwe"
					}, {
						id: 2,
						text: "asd"
					}]
				}];
			});




			$httpBackend.whenPOST('/metadata/AllModelsMetadata/').respond(function() {
				return [200, {
					'AGO.Core.Model.Projects.ProjectParticipantModel': {
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
								'ModelType': 'AGO.Core.Model.Projects.ProjectModel'
							},
							'User': {
								'DisplayName': 'Пользователь',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Documents.DocumentCustomPropertyModel': {
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
								'ModelType': 'AGO.Core.Model.Dictionary.CustomPropertyTypeModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'Document': {
								'DisplayName': 'Документ',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Documents.DocumentModel'
							}
						}
					},
					'AGO.Core.Model.Dictionary.CustomPropertyInstanceModel': {
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
								'ModelType': 'AGO.Core.Model.Dictionary.CustomPropertyTypeModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Dictionary.CustomPropertyTypeModel': {
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
								'ModelType': 'AGO.Core.Model.Dictionary.CustomPropertyTypeModel'
							},
							'Parent': {
								'DisplayName': 'Предшественник',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Dictionary.CustomPropertyTypeModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Dictionary.Documents.DocumentAddresseeModel': {
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
								'ModelType': 'AGO.Core.Model.Dictionary.Documents.DocumentAddresseeModel'
							},
							'ReceivingDocuments': {
								'DisplayName': 'Документы (кому)',
								'IsCollection': true,
								'ModelType': 'AGO.Core.Model.Documents.DocumentModel'
							},
							'Parent': {
								'DisplayName': 'Предшественник',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Dictionary.Documents.DocumentAddresseeModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Dictionary.Documents.DocumentCategoryModel': {
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
								'ModelType': 'AGO.Core.Model.Dictionary.Documents.DocumentCategoryModel'
							},
							'Documents': {
								'DisplayName': 'Документы',
								'IsCollection': true,
								'ModelType': 'AGO.Core.Model.Documents.DocumentModel'
							},
							'Parent': {
								'DisplayName': 'Предшественник',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Dictionary.Documents.DocumentCategoryModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Dictionary.Documents.DocumentStatusModel': {
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
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Dictionary.OrgStructure.DepartmentModel': {
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
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'Children': {
								'DisplayName': 'Последователи',
								'IsCollection': true,
								'ModelType': 'AGO.Core.Model.Dictionary.OrgStructure.DepartmentModel'
							},
							'Parent': {
								'DisplayName': 'Предшественник',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Dictionary.OrgStructure.DepartmentModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Dictionary.Projects.ProjectStatusModel': {
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
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Documents.DocumentCommentModel': {
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
								'ModelType': 'AGO.Core.Model.Documents.DocumentModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Documents.DocumentModel': {
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
								'ModelType': 'AGO.Core.Model.Documents.DocumentStatusHistoryModel'
							},
							'Categories': {
								'DisplayName': 'Категории документов',
								'IsCollection': true,
								'ModelType': 'AGO.Core.Model.Dictionary.Documents.DocumentCategoryModel'
							},
							'Comments': {
								'DisplayName': 'Комментарии',
								'IsCollection': true,
								'ModelType': 'AGO.Core.Model.Documents.DocumentCommentModel'
							},
							'Receivers': {
								'DisplayName': 'Адресаты (кому)',
								'IsCollection': true,
								'ModelType': 'AGO.Core.Model.Dictionary.Documents.DocumentAddresseeModel'
							},
							'CustomProperties': {
								'DisplayName': 'Параметры',
								'IsCollection': true,
								'ModelType': 'AGO.Core.Model.Documents.DocumentCustomPropertyModel'
							},
							'Status': {
								'DisplayName': 'Статус',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Dictionary.Documents.DocumentStatusModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Documents.DocumentStatusHistoryModel': {
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
								'ModelType': 'AGO.Core.Model.Documents.DocumentModel'
							},
							'Status': {
								'DisplayName': 'Статус',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Dictionary.Documents.DocumentStatusModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Projects.ProjectModel': {
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
								'ModelType': 'AGO.Core.Model.Projects.ProjectStatusHistoryModel'
							},
							'Participants': {
								'DisplayName': 'Участники проекта',
								'IsCollection': true,
								'ModelType': 'AGO.Core.Model.Projects.ProjectParticipantModel'
							},
							'Status': {
								'DisplayName': 'Статус проекта',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Dictionary.Projects.ProjectStatusModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Projects.ProjectStatusHistoryModel': {
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
								'ModelType': 'AGO.Core.Model.Projects.ProjectModel'
							},
							'Status': {
								'DisplayName': 'Статус',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Dictionary.Projects.ProjectStatusModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Security.UserGroupModel': {
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
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					},
					'AGO.Core.Model.Security.UserModel': {
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
								'ModelType': 'AGO.Core.Model.Dictionary.OrgStructure.DepartmentModel'
							},
							'Group': {
								'DisplayName': 'Группа',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserGroupModel'
							},
							'Creator': {
								'DisplayName': 'Кто создал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							},
							'LastChanger': {
								'DisplayName': 'Кто последний раз редактировал',
								'IsCollection': false,
								'ModelType': 'AGO.Core.Model.Security.UserModel'
							}
						}
					}
				}];
			});

			//all others
			$httpBackend.whenGET(/^(projects|ng-modules|components)*/).passThrough();
			$httpBackend.whenPOST(/^(\/api)*/).passThrough();

			var generateTimer;

			function updatePercent() {

				if (generateTimer) {
					clearTimeout(generateTimer);
				}

				var generatingExist = false;
				for (var i = 0; i < userReports.rows.length; i++) {
					if (userReports.rows[i].Status !== 'done') {
						generatingExist = true;
						var currentPercent = userReports.rows[i].Percent;
						if (currentPercent >= 100) {
							userReports.rows[i].Status = "done";
							reportService.setReports(userReports.rows);
						} else {
							userReports.rows[i].Percent = currentPercent + 10;
							reportService.setReports(userReports.rows);
						}
					}
				}


				generateTimer = window.setTimeout(function() {
					if (generatingExist) {
						updatePercent();
					}
				}, 1000);
			}

			function generateReport(prms) {
				$timeout(function() {
					userReports.rows.unshift({
						"Id": "5",
						"Name": "Report " + new Date(),
						"Status": "generating",
						"Percent": 0,
						"StartDate": new Date()
					});
					reportService.setReports(userReports.rows);

					updatePercent();

				}, 1000);

				return [200];
			}

			function getProjects() {
				return [200, {
					"rows": [{
						"Id": "play2",
						"Name": "Play 2.0"
					}, {
						"Id": "prj2",
						"Name": "Play 1.2.4"
					}, {
						"Id": "prj3",
						"Name": "Website"
					}, {
						"Id": "prj4",
						"Name": "Secret project"
					}, {
						"Id": "prj5",
						"Name": "Playmate"
					}, {
						"Id": "prj6",
						"Name": "Things to do"
					}]
				}];
			}

			var userReports = {
				"rows": [{
					"Id": "1",
					"Name": "Report1",
					"Status": "generating",
					"Percent": 10,
					"StartDate": new Date()
				}, {
					"Id": "2",
					"Name": "Report2",
					"Status": "generating",
					"Percent": 30,
					"StartDate": new Date()
				}, {
					"Id": "3",
					"Name": "Report3",
					"Status": "done",
					"StartDate": new Date(),
					"EndDate": new Date()
				}, {
					"Id": "4",
					"Name": "Report4",
					"Status": "done",
					"StartDate": new Date(),
					"EndDate": new Date()
				}]
			};

			function getUserReports() {
				return [200, userReports];
			}


			function getUnreadUserReports() {

				updatePercent();
				return [200, userReports];

			}

		}
	]);