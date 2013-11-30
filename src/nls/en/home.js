define(['../../home/moduleDef'], function (module) {
	module.run(['i18n', function(i18n) {
		i18n.addMessages('projects', {
			'fields': {
				'code': 'Project code',
				'status': 'Status',
				'tags': 'Tags'
			},

			'list': {
				'title': 'Projects',
				'buttons': {
					'add': 'New project'
				},

				'filters': {
					'participation': {
						'label': 'Projects',
						'all': 'Any',
						'me': 'My'
					}
				}
			},
			'create': {
				'title': 'New project',
				'legend': 'Creating new project',
				'placeholders': {
					'type': 'Select project type'
				}
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
});