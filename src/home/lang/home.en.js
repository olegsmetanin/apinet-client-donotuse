angular.module('home').run(['i18n', function(i18n) {
	i18n.addMessages('projects', {
		'roles': {
			'admin': 'Admin',
			'manager': 'Manager'
		},

		'fields': {
			'code': 'Project code',
			'status': 'Status',
			'tags': 'Tags',
			'isArchive': 'Archive'
		},

		'list': {
			'title': 'Projects',
			'buttons.add': 'New project',

			'filters': {
				'participation': 'Participation',
				'participation.all': 'All',
				'participation.me': 'I\'am participant'
			}
		},
		'create': {
			'title': 'New project',
			'legend': 'Creating new project'
		},
		'statuses': {
			'title': 'Statuses dictionary',
			'buttons.add': 'New status'
		},
		'tags': {
			'title': 'Tags dictionary',
			'buttons.add': 'New tag',

			'filters': {
				'ownership': 'Ownership',
				'ownership.personal': 'Personal tags',
				'ownership.common': 'Common tags'
			}
		}
	});
}]);