sysConfig.modules['tasks'] = {
	css: [
		'src/tasks/assets/lists.css',
		'src/tasks/assets/form.css'
	],
	js: [
		'src/tasks/_module.js',
		'src/tasks/task/taskList.js',
		'src/tasks/task/create/taskCreate.js',
		'src/tasks/task/view/taskTabs.js',
		'src/tasks/task/view/taskView.js',
		'src/tasks/task/executorsView.js',
		'src/tasks/task/statusHistoryView.js',
		'src/tasks/task/customPropertiesView.js',
		'src/tasks/task/agreementsView.js',

		'src/tasks/task-type/taskTypeList.js',
		'src/tasks/custom-status/customStatusList.js'
	]
};