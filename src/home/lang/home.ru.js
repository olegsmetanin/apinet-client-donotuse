angular.module('home').run(['i18n', function(i18n) {
	i18n.addMessages('projects', {
		'roles': {
			'admin': 'Администратор',
			'manager': 'Менеджер'
		},

		'fields': {
			'code': 'Код проекта',
			'status': 'Статус',
			'tags': 'Теги',
			'isArchive': 'Архив'
		},

		'list': {
			'title': 'Проекты',
			'buttons.add': 'Новый проект',

			'filters': {
				'participation': 'Участие',
				'participation.all': 'Все',
				'participation.me': 'Я участник'
			}
		},
		'create': {
			'title': 'Новый проект',
			'legend': 'Создание нового проекта'
		},
		'statuses': {
			'title': 'Справочник статусов',
			'buttons.add': 'Новый статус'
		},
		'tags': {
			'title': 'Справочник тегов',
			'buttons.add': 'Новый тег',

			'filters': {
				'ownership': 'Принадлежность',
				'ownership.personal': 'Персональные теги',
				'ownership.common': 'Общие теги'
			}
		}
	});
}]);