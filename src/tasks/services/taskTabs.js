define(['../moduleDef'], function (module) {
	module.service('taskTabs', ['i18n', function(i18n) {
		return {
			build: function(num) {
				return [
					{
						name: 'overview',
						sref: 'page.project.taskView({num: \'' + num + '\'})',
						text: i18n.msg('tasks.view.tabs.overview')
					},
					{
						name: 'comments',
						sref: 'page.project.taskComments({num: \'' + num + '\'})',
						text: i18n.msg('tasks.view.tabs.comments'),

					},
					{
						name: 'files',
						sref: 'page.project.taskFiles({num: \'' + num + '\'})',
						text: i18n.msg('tasks.view.tabs.files')
					}
				];
			}
		}
	}])
});
