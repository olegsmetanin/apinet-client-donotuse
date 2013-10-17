angular.module('home').run(['i18n', function(i18n) {
	i18n.addMessages('projects', {
		'roles': {
			'title': 'Roles ({{role}})',
			'admin': 'Admin',
			'manager': 'Manager',
			'nothing': 'nothing'
		},

		'fields': {
			'code': 'Project code',
			'status': 'Status',
			'tags': 'Tags',
			'isArchive': 'Archive'
		},

		'list': {
			'title': 'Projects',
			'buttons': {
				'add': 'New project'
			},

			'filters': {
				'participation': {
					'label': 'Participation',
					'all': 'All',
					'me': 'I\'am participant'
				}
			}
		},
		'create': {
			'title': 'New project',
			'legend': 'Creating new project'
		},
		'statuses': {
			'title': 'Statuses dictionary',
			'buttons': {
				'add': 'New status'
			}
		},
		'tags': {
			'title': 'Tags dictionary',
			'buttons': {
				'add': 'New tag'
			},

			'filters': {
				'ownership': {
					'label': 'Ownership',

					'personal': 'Personal tags',
					'common': 'Common tags'
				}
			}
		}
	});
}]);