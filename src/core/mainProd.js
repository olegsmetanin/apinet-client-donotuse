require.config({
	paths: {
		'css': 'core/module',
		'i18n': 'core/module',

		'jquery': 'core/module',
		'angular': 'core/module',

		'core/nls/ru/bootstrap_datepicker': 'core/module.ru',
		'core/nls/en/bootstrap_datepicker': 'core/module.en',

		'core/nls/en/angular': 'core/module.en',
		'core/nls/ru/angular': 'core/module.ru',

		'core/nls/ru/moment': 'core/module.ru',

		'core/nls/en/module': 'core/module.en',
		'core/nls/ru/module': 'core/module.ru'
	}
});

require(['jquery'], function ($) {
	require(['angular', 'core/module', 'modernizr', 'core/themes/flatty/theme'], function (angular, module, modernizr) {
		$(document).ready(function () {
            var $body = $('body');
			angular.bootstrap($body, [module.name]);
            $body.removeClass('progrecss green');
            // iOS FIXED FIX
            if (modernizr.touch) {
                $(document).on('focus', 'input', function (e) {
                    $body.addClass('fixfixed');
                    setTimeout(function () {
                        $(document).scrollTop($(this).scrollTop())
                    }, 10);
                });
                $(document).on('blur', 'input', function (e) {
                    $body.removeClass('fixfixed');
                });
            }
		});
	});
});