angular.module('core')
    .filter('i18n', ["i18n",
        function(i18n) {
            return function(key) {
                return i18n[key];
            }
        }
    ]);