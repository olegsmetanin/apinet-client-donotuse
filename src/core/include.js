sysConfig.modules['core'] = {
	css: [
		'src/core/assets/filtering-component.css',
		'src/core/assets/filtered-list.css',
		'src/core/assets/spinner.css',
		'src/core/assets/header.css',
		'src/core/assets/inline-edit.css',
		'src/core/assets/inputs.css'
	],
	js: [
		'src/core/_module.js',
		
		'src/core/directives/relinclude.js',
		'src/core/directives/buttonToggle.js',
		'src/core/directives/checker.js',
		'src/core/directives/integer.js',
		'src/core/directives/lookup.js',
		'src/core/directives/requiredMultiple.js',
		'src/core/directives/ago.select2.js',
		'src/core/directives/grids.js',

		'src/core/directives/inplace/inlineEdit.js',
		'src/core/directives/inplace/inlineText.js',
		'src/core/directives/inplace/inlineTextArea.js',
		'src/core/directives/inplace/inlineLookup.js',
		'src/core/directives/inplace/inlineDate.js',
		'src/core/directives/inplace/inlineButtons.js',

		'src/core/directives/filters/filters.js',
		'src/core/directives/filters/services.js',
		'src/core/directives/filters/directives.js',
		'src/core/directives/filters/userFilter.js',
		'src/core/directives/filters/structuredFilter.js',
		
		'src/core/parts/header/breadCrumbs/breadCrumbsCtrl.js',
		'src/core/parts/header/tabBar/tabBar.js',
		'src/core/parts/header/tabBar/topTabBar.js',
		'src/core/parts/masterpages/directives.js',

		'src/core/services/security/index.js',
		'src/core/services/security/authorization.js',
		'src/core/services/security/interceptor.js',
		'src/core/services/security/retryQueue.js',
		'src/core/services/security/security.js',
		'src/core/parts/loginform/login.js',
		'src/core/parts/loginform/LoginFormController.js',

		'src/core/parts/header/moduleMenu/moduleMenu.js',
		'src/core/parts/header/userMenu/userMenu.js',
		'src/core/services/reportService/reportService.js',
		'src/core/parts/header/reportNotifier/reportNotifier.js',
		'src/core/parts/header/eventNotifier/eventNotifier.js',
		
		'src/core/services/services.js',
		'src/core/services/i18n/i18n.js',

		'src/core/services/messageService/messageService.js',

		'src/core/pages/userReports/userReports.js',

		'src/core/services/coreConfig.js',
		'src/core/services/moduleConfig.js',
		'src/core/services/pageConfig.js',

		'src/core/services/apinet/apinetService.js',
		'src/core/services/apinet/metadataService.js',
		'src/core/services/apinet/dictionaryService.js'

	]
};