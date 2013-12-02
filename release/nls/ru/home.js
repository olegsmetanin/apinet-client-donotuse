define(['../../home/moduleDef'], function (module) {
	module.run(['i18n', function(i18n) {
		i18n.addMessages('projects', {
			'fields': {
				'code': 'Код проекта',
				'status': 'Статус',
				'tags': 'Теги'
			},

			'list': {
				'title': 'Проекты',
				'buttons': {
					'add': 'Новый проект'
				},

				'filters': {
					'participation': {
						'label': 'Проекты',

						'all': 'Любые',
						'me': 'Мои'
					}
				}
			},
			'create': {
				'title': 'Новый проект',
				'legend': 'Создание нового проекта',
				'placeholders': {
					'type': 'Выберите тип проекта'
				}
			},
			'statuses': {
				'title': 'Справочник статусов',
				'buttons': {
					'add': 'Новый статус'
				}
			},
			'tags': {
				'title': 'Справочник тегов',
				'buttons': {
					'add': 'Новый тег'
				},

				'filters': {
					'ownership': {
						'label': 'Принадлежность',
						'personal': 'Персональные теги',
						'common': 'Общие теги'
					}
				}
			}
		});
	}]);
});