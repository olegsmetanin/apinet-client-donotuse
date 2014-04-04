define(['../../moduleDef', 'jquery'], function (module, $) {
	var i18n = $('body').injector().get('i18n');
	i18n.registerLocalizationModule('tasks/nls/module');

	module.service('tasks/nls/module/ru', ['i18n', function(i18n) {
		return function() {
			i18n.addMessages('tasks', {
                'priority': {
                    'normal': 'Нормальный'
                },

				'fields': {
					'seqNumber': 'Номер задачи',
					'type': 'Тип задачи',
					'executors': 'Исполнители',
					'dueDate': 'Срок',
					'content': 'Содержание',
					'status': 'Статус',
					'priority': 'Приоритет',
					'note': 'Примечание',
					'agreements': 'Согласования',
					'topFiles': 'Файлы (топ {{count}})',
					'tags': 'Теги',
					'estimatedTime': 'Планируемое время',
					'spentTime': 'Затраченное время'
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
						'overview': 'Свойства',
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
							'comment': 'Комментарий'
						},

						'placeholders': {
							'agreemer': 'Выберите согласующего',
							'dueDate': 'Срок',
							'comment': 'Комментарий к согласованию'
						},

						'buttons': {
							'agreement': {
								'dropdown': 'Действия',
								'add': 'Добавить согласующего',
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
						},

						'period': 'с {{start}} по {{finish}}',
						'duration': {
							'days': {
								'one': 'день',
								'few': 'дня',
								'many': 'дней',
								'other': 'дней'
							},
							'hours': {
								'one': 'час',
								'few': 'часа',
								'many': 'часов',
								'other': 'часов'
							},
							'minutes': 'м'
						}
					},
					'params': {
						'title': 'Пользовательские свойства',
						'empty': 'Нет пользовательских свойств',
						'placeholders': {
							'selectType': 'выберите параметр',
							'string': 'строка',
							'number': 'число',
							'date': 'дата'
						},
						'numFormat': 'Ожидаемый формат 0##[.0##]'
					},
					'files': {
						'title': 'Файлы',
						'fields': { 'size': 'Размер файла' }
					},
					'timelog': {
						'title': 'Затраченное время',
						'empty': 'Нет записей',
						'placeholders': {
							'time': 'Затраченное время (часы)',
							'comment': 'Комментарий (опционально)'
						},
						'fields': {
							'time': 'Время',
							'comment': 'Комментарий'
						},
						'closed': 'Задача уже закрыта'
					}
				},

				'list': {
					'title': 'Задачи',

					'filters': {
						'custom': 'Комбинированный',
						'predefined': {
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
						'add': 'Создать задачу',
						'reportDefault': 'Список задач',
						'detailedTaskList': 'Подробный список задач'
					},

					'placeholders': {
						'delete': 'Удалить задачу',
						'deleteSelected': 'Удалить отмеченные задачи'
					},

					'expiration': {
						'already': 'Просрочена {{days}} {{daysText}}',
						'will': 'Будет просрочена через {{days}} {{daysText}}'
					}
				},

				'create': {
					'title': 'Создание задачи',

					'placeholders': {
						'type': 'Выберите тип задачи',
						'executors': 'Выберите исполнителей',
						'priority': 'Выберите приоритет'
					},

					'labels': {
						'afterCreation': 'После создания задачи',
						'afterCreationGoToTask': 'Перейти к созданной',
						'afterCreationGoToList': 'Перейти в реестр задач',
						'afterCreationStayHere': 'Создать другую задачу'
					},

					'buttons': {
						'save': 'Создать задачу'
					}
				},

				'types': {
					'title': 'Типы задачи',

					'placeholders': {
						'name': 'Наименование типа задачи',
						'replacementType': 'С заменой на ...'
					},

					'buttons': {
						'delete': 'Удалить тип задачи'
					}
				},

				'tags': {
					'type': 'Теги задач'
				}
			});
		};
	}]);

	i18n.setLocale(null);
});