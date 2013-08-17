/* global sysConfig: true */
sysConfig.modules['core'] = {
    css: [
        "src/core/assets/filtering-component.css",
        "src/core/assets/spinner.css",
        "src/core/assets/breadcrumbs.css",
        "src/core/assets/counter.css",
        "src/core/assets/avatar.css"
    ],
    js: [
        "src/core/_module.js",
        "src/core/relinclude/relinclude.js",
        "src/core/breadcrumbs/breadcrumbsCtrl.js",
        "src/core/tabbar/tabbar.js",

        "src/core/security/index.js",
        "src/core/security/authorization.js",
        "src/core/security/interceptor.js",
        "src/core/security/retryQueue.js",
        "src/core/security/security.js",
        "src/core/loginform/login.js",
        "src/core/loginform/LoginFormController.js",
        "src/core/usermenu/usermenu.js",

        "src/core/services/services.js",
        "src/core/services/localizedMessages.js",
        "src/core/filters/ago-filter-builder.js",
        "src/core/filters/ago-jquery-helpers.js",
        "src/core/filters/ago-jquery-structured-filter.js",
        "src/core/filters/ago-jquery-custom-properties-filter.js",
        "src/core/filters/complex.js",
		"src/core/filters/filterModel.js",
		"src/core/filters/structuredFilter.js",

        "src/core/i18n/i18n.js",
        "src/core/modulemenu/modulemenu.js"
    ]
};