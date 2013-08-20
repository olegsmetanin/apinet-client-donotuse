angular.module('home')
    .run(['i18n',
        function(i18n) {
             angular.extend(i18n, {
                'test2':'test2ru'
            });
        }
    ]);
