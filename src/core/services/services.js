/* global angular: true */
angular.module('core')
    .service("pageConfig", ['$rootScope',
		function($rootScope) {
			angular.extend(this, {
				current: { },
				setConfig: function(newConfig) {
					this.current = newConfig;
					$rootScope.$broadcast('page:configChanged');
				}
			});
		}
    ])
	.service("helpers", function() {
		angular.extend(this, {
			trimRegex: /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

			trim: function (text) {
				return text === null ? '' :
					(text + '').replace(this.trimRegex, '');
			},

			isoDateTimeString: function (date) {
				var padString = function (n) {
					return n < 10 ? '0' + n : n;
				};
				return date.getUTCFullYear() + '-' +
					padString(date.getUTCMonth() +	1) + '-' +
					padString(date.getUTCDate()) + 'T' +
					padString(date.getUTCHours()) +	':' +
					padString(date.getUTCMinutes()) + ':' +
					padString(date.getUTCSeconds()) + 'Z';
			},

			localDateString: function (date) {
				var padString = function (n) {
					return n < 10 ? '0' + n : n;
				};
				return padString(date.getDate()) + '.' +
					padString(date.getMonth() + 1) + '.' +
					date.getFullYear();
			},

			localDateTimeString: function (date) {
				var padString = function (n) {
					return n < 10 ? '0' + n : n;
				};
				return padString(date.getDate()) + '.' +
					padString(date.getMonth() + 1) + '.' +
					date.getFullYear() + ' ' +
					padString(date.getHours()) + ':' +
					padString(date.getMinutes()) /* + ':' +
					padString(date.getSeconds())*/;
			}
		});
	});