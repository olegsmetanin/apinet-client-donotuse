define([
	'./moduleDef',
	'./states',
	'./directives',
	'./services',
	'i18n!./nls/module'
], function(module) {
	return module.constant('taskStatuses', {
		New: 'New',
		Doing: 'Doing',
		Done: 'Done',
		Discarded: 'Discarded',
		Closed: 'Closed'
	}).constant('taskPriorities', {
        Low: 'Low',
        Normal: 'Normal',
        High: 'High'
    });
});