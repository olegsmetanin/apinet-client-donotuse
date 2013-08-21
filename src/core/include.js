sysConfig.modules['core'] = {
	css: [
		"src/core/assets/filtering-component.css",
		"src/core/assets/spinner.css",
		"src/core/assets/breadcrumbs.css",
		"src/core/assets/header.css",
		"src/core/assets/chartbox.css"
	],
	js: [
		"src/core/_module.js",
		"src/core/directives/relinclude.js",
		"src/core/parts/header/breadCrumbs/breadCrumbsCtrl.js",
		"src/core/parts/header/tabBar/tabBar.js",
		"src/core/parts/header/tabBar/topTabBar.js",

		"src/core/parts/masterpages/directives.js",

		"src/core/services/security/index.js",
		"src/core/services/security/authorization.js",
		"src/core/services/security/interceptor.js",
		"src/core/services/security/retryQueue.js",
		"src/core/services/security/security.js",
		"src/core/parts/loginform/login.js",
		"src/core/parts/loginform/LoginFormController.js",
		"src/core/parts/header/userMenu/userMenu.js",

		"src/core/services/services.js",
		"src/core/services/i18n/localizedMessages.js",
		"src/core/parts/filters/ago-filter-builder.js",
		"src/core/parts/filters/ago-jquery-helpers.js",
		"src/core/parts/filters/ago-jquery-structured-filter.js",
		"src/core/parts/filters/ago-jquery-custom-properties-filter.js",
		"src/core/parts/filters/complex.js",
		"src/core/parts/filters/filterHelpers.js",
		"src/core/parts/filters/structuredFilter.js",
		"src/core/parts/filters/userFilter.js",

		"src/core/services/i18n/i18n.js",
		"src/core/parts/header/moduleMenu/moduleMenu.js",

		"src/core/services/reportService/reportService.js",
		"src/core/parts/header/reportNotifier/reportNotifier.js",

		"src/core/services/messageService/messageService.js",

		"src/core/pages/userReports/userReports.js",

		"src/core/services/apinet/core.js",
		"src/core/services/apinet/dictionary.js",
		"src/core/services/apinet/projects.js"
	]
};