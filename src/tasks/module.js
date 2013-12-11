define([
	'./moduleDef',
	'./states',
	'./directives',
	'i18n!./nls/module'
], function(module) {
	return module.constant('taskStatuses', {
		New: 'New',
		Doing: 'Doing',
		Done: 'Done',
		Discarded: 'Discarded',
		Closed: 'Closed'
	});
});