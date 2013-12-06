define(['../moduleDef', 'angular'], function (module, angular) {
	module.service('helpers', function () {
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
					padString(date.getUTCMonth() + 1) + '-' +
					padString(date.getUTCDate()) + 'T' +
					padString(date.getUTCHours()) + ':' +
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
					padString(date.getMinutes());
			},

			dateObjectFromUTC: function (s) {
				s = s.split(/[-: ]/g);
				return new Date(Date.UTC(+s[0], --s[1], +s[2], +s[3], +s[4], +s[5], 0));
			}
		});
	})
	.filter('yesNo', function() {
		return function(value){
			return !!value ? 'Да' : 'Нет';
		};
	})
	.filter('joinBy', function () {
		return function (input, delimiter) {
			return (input || []).join(delimiter || ',');
		};
	})
	.filter('textCut', function() {
		return function(input, max) {
			if (!input) {
				return input;
			}

			var result = angular.isString(input) ? input : input.toString();
			max = max || 35;
			if (result.length <= max){
				return result;
			}
			return result.substring(0, max - 1) + '…';
		};
	});
});
