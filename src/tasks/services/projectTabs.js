define(['../moduleDef'], function (module) {
	module.service('projectTabs', ['i18n', function(i18n) {
		return {
			build: function(project) {
				return [
					{
						name: 'overview',
						sref: 'page.project.settings({project: \'' + project + '\'})',
						text: i18n.msg('projects.settings.tabs.overview')
					},
					{
						name: 'members',
						sref: 'page.project.settings.members({project: \'' + project + '\'})',
						text: i18n.msg('projects.settings.tabs.members'),

					},
					{
						name: 'templates',
						sref: 'page.project.templates.tasks({project: \'' + project + '\'})',
						text: i18n.msg('projects.settings.tabs.templates')
					}
				];
			}
		}
	}])
});
