angular.module('tasks').run(['i18n', function(i18n) {
	i18n.addMessages('tasks', {

		'roles': {
			'manager': 'Менеджер',
			'executor': 'Исполнитель'
		},

		'menu': {
			'projectInfo': 'Информация о проекте'
		},

		'fields': {
			'seqNumber': 'Номер задачи',
			'type': 'Тип задачи',
			'executors': 'Исполнители',
			'dueDate': 'Срок',
			'content': 'Содержание',
			'status': 'Статус',
			'customStatus': 'Пользовательский статус',
			'priority': 'Приоритет',
			'note': 'Примечание',
			'agreements': 'Согласования',
			'topFiles': 'Файлы (топ {{count}})'
		},

		'confirm': {
			'delete': {
				'task': 'Вы действительно хотите удалить задачу?',
				'tasks': 'Вы действительно хотите удалить задачи?',
				'agreemer': 'Вы действительно хотите удалить согласующего?'
			}
		},

		'view': {
			'tabs': {
				'overview': 'Задача',
				'comments': 'Комментарии',
				'files': 'Файлы'
			},

			'general': {
				'title': 'Общие свойства'
			},
			'agreements': {
				'title': 'Согласования',

				'fields': {
					'agreemer': 'Согласующий',
					'dueDate': 'Срок',
					'done': 'Согласовано',
					'agreedAt': 'Дата',
					'comment': 'Комментарий'
				},

				'placeholders': {
					'agreemer': 'Выберите согласующего',
					'dueDate': 'Срок',
					'comment': 'Комментарий к согласованию'
				},

				'buttons': {
					'agreement': {
						'dropdown': 'Согласование',
						'agree': 'Согласовать',
						'toggleAgree': 'Согласовать с комментарием',
						'revoke': 'Отозвать согласование'
					}
				}
			},
			'statusHistory': {
				'title': 'История статуса',

				'fields': {
					'status': 'Статус',
					'author': 'Установил',
					'effectivePeriod': 'Период действия',
					'duration': 'Продолжительность'
				}
			},
			'customStatusHistory': {
				'title': 'История пользовательского статуса'
			},
			'params': {
				'title': 'Пользовательские свойства'
			}
		},

		'list': {
			'title': 'Задачи',

			'filters': {
				'custom': 'Комбинированный',
				'custom.predefined': {
					'all': 'Все задачи',
					'overdue': 'Просроченные',
					'dayLeft': 'Срок 1 день',
					'weekLeft': 'Срок 7 дней',
					'noLimit': 'Без даты окончания',
					'closedToday': 'Закрыты сегодня',
					'closedYesterday': 'Закрыты вчера'
				}
			},

			'buttons': {
				'add': 'Создать задачу'
			},

			'placeholders': {
				'delete': 'Удалить задачу',
				'deleteSelected': 'Удалить отмеченные задачи'
			}
		},

		'create': {
			'title': 'Создание задачи',

			'placeholders': {
				'type': 'Выберите тип задачи',
				'executors': 'Выберите исполнителей',
				'customStatus': 'Выберите статус',
				'priority': 'Выберите приоритет'
			},

			'labels': {
				'afterCreation': 'После создания задачи',
				'afterCreation.goToTask': 'Перейти к созданной',
				'afterCreation.goToList': 'Перейти в реестр задач',
				'afterCreation.stayHere': 'Создать другую задачу'
			},

			'buttons': {
				'save': 'Создать задачу'
			}
		},

		'types': {
			'title': 'Справочник типов задач',

			'placeholders': {
				'name': 'Наименование типа задачи',
				'replacementType': 'Тип для замены удаляемых (опционально)'
			},

			'buttons': {
				'delete': 'Удалить тип задачи'
			}
		},

		'customStatuses': {
			'title': 'Справочник пользовательских статусов задач',

			'placeholders': {
				'name': 'Наименование статуса задачи',
				'replacementStatus': 'Статус для замены удаляемых (опционально)'
			},

			'buttons': {
				'delete': 'Удалить статус задачи'
			}
		}
	});
}]);