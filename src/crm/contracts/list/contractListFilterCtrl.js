angular.module('crm')

.controller('contractFilterCtrl', ['$scope', '$stateParams',
    function($scope, $stateParams) {
        $scope.state = '{"simple":{"category":{"val":[{"id":1,"text":"cat"},{"id":4,"text":"rat"},{"id":6,"text":"zet"}]},"status":{"val":[{"id":4,"text":"rat"}]},"AuthorFirstName":{"val":[]},"number":{"val":"123","state":{"path":"Contract.Number"}},"startDate":{"val":"312","state":{"path":"Contract.StatusHistory.StartDate"}}}}';

        $scope.filter = {};

        $scope.loadState = function() {
            $scope.filter = angular.fromJson($scope.state);
        };




        $scope.meta = {
            "AGO.Core.Model.Documents.DocumentCustomPropertyModel": {
                "PrimitiveProperties": {
                    "StringValue": {
                        "DisplayName": "Значение-строка",
                        "PropertyType": "string"
                    },
                    "NumberValue": {
                        "DisplayName": "Значение-число",
                        "PropertyType": "float"
                    },
                    "DateValue": {
                        "DisplayName": "Значение-дата",
                        "PropertyType": "date"
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "PropertyType": {
                        "DisplayName": "Тип параметра",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Dictionary.CustomPropertyTypeModel"
                    },
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "Document": {
                        "DisplayName": "Документ",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Documents.DocumentModel"
                    }
                }
            },
            "AGO.Core.Model.Dictionary.CustomPropertyInstanceModel": {
                "PrimitiveProperties": {
                    "StringValue": {
                        "DisplayName": "Значение-строка",
                        "PropertyType": "string"
                    },
                    "NumberValue": {
                        "DisplayName": "Значение-число",
                        "PropertyType": "float"
                    },
                    "DateValue": {
                        "DisplayName": "Значение-дата",
                        "PropertyType": "date"
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "PropertyType": {
                        "DisplayName": "Тип параметра",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Dictionary.CustomPropertyTypeModel"
                    },
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    }
                }
            },
            "AGO.Core.Model.Dictionary.CustomPropertyTypeModel": {
                "PrimitiveProperties": {
                    "ProjectCode": {
                        "DisplayName": "Код проекта",
                        "PropertyType": "string"
                    },
                    "Name": {
                        "DisplayName": "Наименование",
                        "PropertyType": "string"
                    },
                    "FullName": {
                        "DisplayName": "Полное наименование",
                        "PropertyType": "string"
                    },
                    "Format": {
                        "DisplayName": "Формат",
                        "PropertyType": "string"
                    },
                    "ValueType": {
                        "DisplayName": "Тип значения",
                        "PropertyType": "enum",
                        "PossibleValues": {
                            "String": "Строка",
                            "Number": "Число",
                            "Date": "Дата"
                        }
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "Children": {
                        "DisplayName": "Последователи",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Dictionary.CustomPropertyTypeModel"
                    },
                    "Parent": {
                        "DisplayName": "Предшественник",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Dictionary.CustomPropertyTypeModel"
                    },
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    }
                }
            },
            "AGO.Core.Model.Dictionary.DepartmentModel": {
                "PrimitiveProperties": {
                    "ProjectCode": {
                        "DisplayName": "Код проекта",
                        "PropertyType": "string"
                    },
                    "Name": {
                        "DisplayName": "Наименование",
                        "PropertyType": "string"
                    },
                    "FullName": {
                        "DisplayName": "Полное наименование",
                        "PropertyType": "string"
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "Users": {
                        "DisplayName": "Пользователи",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "Children": {
                        "DisplayName": "Последователи",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Dictionary.DepartmentModel"
                    },
                    "Parent": {
                        "DisplayName": "Предшественник",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Dictionary.DepartmentModel"
                    },
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    }
                }
            },
            "AGO.Core.Model.Dictionary.DocumentAddresseeModel": {
                "PrimitiveProperties": {
                    "ProjectCode": {
                        "DisplayName": "Код проекта",
                        "PropertyType": "string"
                    },
                    "Name": {
                        "DisplayName": "Наименование",
                        "PropertyType": "string"
                    },
                    "FullName": {
                        "DisplayName": "Полное наименование",
                        "PropertyType": "string"
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "Children": {
                        "DisplayName": "Последователи",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Dictionary.DocumentAddresseeModel"
                    },
                    "ReceivingDocuments": {
                        "DisplayName": "Документы (кому)",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Documents.DocumentModel"
                    },
                    "Parent": {
                        "DisplayName": "Предшественник",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Dictionary.DocumentAddresseeModel"
                    },
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    }
                }
            },
            "AGO.Core.Model.Dictionary.DocumentCategoryModel": {
                "PrimitiveProperties": {
                    "ProjectCode": {
                        "DisplayName": "Код проекта",
                        "PropertyType": "string"
                    },
                    "Name": {
                        "DisplayName": "Наименование",
                        "PropertyType": "string"
                    },
                    "FullName": {
                        "DisplayName": "Полное наименование",
                        "PropertyType": "string"
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "Children": {
                        "DisplayName": "Последователи",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Dictionary.DocumentCategoryModel"
                    },
                    "Documents": {
                        "DisplayName": "Документы",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Documents.DocumentModel"
                    },
                    "Parent": {
                        "DisplayName": "Предшественник",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Dictionary.DocumentCategoryModel"
                    },
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    }
                }
            },
            "AGO.Core.Model.Dictionary.DocumentStatusModel": {
                "PrimitiveProperties": {
                    "ProjectCode": {
                        "DisplayName": "Код проекта",
                        "PropertyType": "string"
                    },
                    "Name": {
                        "DisplayName": "Наименование",
                        "PropertyType": "string"
                    },
                    "Description": {
                        "DisplayName": "Описание",
                        "PropertyType": "string"
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    }
                }
            },
            "AGO.Core.Model.Documents.DocumentCommentModel": {
                "PrimitiveProperties": {
                    "ExternalAuthor": {
                        "DisplayName": "Автор - внешний пользователь",
                        "PropertyType": "string"
                    },
                    "Text": {
                        "DisplayName": "Текст",
                        "PropertyType": "string"
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "Document": {
                        "DisplayName": "Документ",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Documents.DocumentModel"
                    },
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    }
                }
            },
            "AGO.Core.Model.Documents.DocumentModel": {
                "PrimitiveProperties": {
                    "SeqNumber": {
                        "DisplayName": "Номер п/п",
                        "PropertyType": "string"
                    },
                    "DocumentType": {
                        "DisplayName": "Тип документа",
                        "PropertyType": "enum",
                        "PossibleValues": {
                            "Incoming": "Входящие",
                            "Outgoing": "Исходящие",
                            "Internal": "Внутренние"
                        }
                    },
                    "Annotation": {
                        "DisplayName": "Краткое содержание",
                        "PropertyType": "string"
                    },
                    "Content": {
                        "DisplayName": "Содержание",
                        "PropertyType": "string"
                    },
                    "Date": {
                        "DisplayName": "Дата документа",
                        "PropertyType": "date"
                    },
                    "Number": {
                        "DisplayName": "Номер документа",
                        "PropertyType": "string"
                    },
                    "SourceDocUrl": {
                        "DisplayName": "Url исходного документа",
                        "PropertyType": "string"
                    },
                    "SourceDocDate": {
                        "DisplayName": "Дата исходного документа",
                        "PropertyType": "date"
                    },
                    "SourceDocNumber": {
                        "DisplayName": "Номер исходного документа",
                        "PropertyType": "string"
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "StatusHistory": {
                        "DisplayName": "История статусов документа",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Documents.DocumentStatusHistoryModel"
                    },
                    "Categories": {
                        "DisplayName": "Категории документов",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Dictionary.DocumentCategoryModel"
                    },
                    "Comments": {
                        "DisplayName": "Комментарии",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Documents.DocumentCommentModel"
                    },
                    "Receivers": {
                        "DisplayName": "Адресаты (кому)",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Dictionary.DocumentAddresseeModel"
                    },
                    "CustomProperties": {
                        "DisplayName": "Параметры",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Documents.DocumentCustomPropertyModel"
                    },
                    "Status": {
                        "DisplayName": "Статус",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Dictionary.DocumentStatusModel"
                    },
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    }
                }
            },
            "AGO.Core.Model.Documents.DocumentStatusHistoryModel": {
                "PrimitiveProperties": {
                    "StartDate": {
                        "DisplayName": "Дата начала",
                        "PropertyType": "date"
                    },
                    "EndDate": {
                        "DisplayName": "Дата конца",
                        "PropertyType": "date"
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "Document": {
                        "DisplayName": "Документ",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Documents.DocumentModel"
                    },
                    "Status": {
                        "DisplayName": "Статус",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Dictionary.DocumentStatusModel"
                    },
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    }
                }
            },
            "AGO.Core.Model.Security.UserGroupModel": {
                "PrimitiveProperties": {
                    "Name": {
                        "DisplayName": "Наименование",
                        "PropertyType": "string"
                    },
                    "Description": {
                        "DisplayName": "Описание",
                        "PropertyType": "string"
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "Users": {
                        "DisplayName": "Пользователи",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    }
                }
            },
            "AGO.Core.Model.Security.UserModel": {
                "PrimitiveProperties": {
                    "Login": {
                        "DisplayName": "Логин",
                        "PropertyType": "string"
                    },
                    "PwdHash": {
                        "DisplayName": "MD5 хеш для авторизации в WebDav",
                        "PropertyType": "string"
                    },
                    "Active": {
                        "DisplayName": "Активен",
                        "PropertyType": "boolean"
                    },
                    "Name": {
                        "DisplayName": "Имя",
                        "PropertyType": "string"
                    },
                    "LastName": {
                        "DisplayName": "Фамилия",
                        "PropertyType": "string"
                    },
                    "MiddleName": {
                        "DisplayName": "Отчество",
                        "PropertyType": "string"
                    },
                    "FIO": {
                        "DisplayName": "ФИО",
                        "PropertyType": "string"
                    },
                    "WhomFIO": {
                        "DisplayName": "Фамилия с инициалами (родительный)",
                        "PropertyType": "string"
                    },
                    "JobName": {
                        "DisplayName": "Краткое наименование должности (именительный)",
                        "PropertyType": "string"
                    },
                    "WhomJobName": {
                        "DisplayName": "Краткое наименование должности (родительный)",
                        "PropertyType": "string"
                    },
                    "LastChangeTime": {
                        "DisplayName": "Когда последний раз редактировали",
                        "PropertyType": "date"
                    },
                    "CreationTime": {
                        "DisplayName": "Дата создания",
                        "PropertyType": "datetime"
                    },
                    "Id": {
                        "DisplayName": "Идентификатор",
                        "PropertyType": "guid"
                    }
                },
                "ModelProperties": {
                    "Departments": {
                        "DisplayName": "Подразделения",
                        "IsCollection": true,
                        "ModelType": "AGO.Core.Model.Dictionary.DepartmentModel"
                    },
                    "Group": {
                        "DisplayName": "Группа",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserGroupModel"
                    },
                    "Creator": {
                        "DisplayName": "Кто создал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    },
                    "LastChanger": {
                        "DisplayName": "Кто последний раз редактировал",
                        "IsCollection": false,
                        "ModelType": "AGO.Core.Model.Security.UserModel"
                    }
                }
            }

        };



    }
]);