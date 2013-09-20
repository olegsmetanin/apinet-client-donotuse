angular.module('tasks')
    .run(['i18n',
        function(i18n) {
             angular.extend(i18n, {
                'tasks.title':'Tasks'
            });
        }
    ]);