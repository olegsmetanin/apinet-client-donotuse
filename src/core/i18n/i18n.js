angular.module('core')
    .value('i18n', {})
    .filter('i18n', ["i18n",
        function(i18n) {
            return function(key) {
                return i18n[key];
            };
        }
    ]);