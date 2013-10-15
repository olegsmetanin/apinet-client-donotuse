angular.module('core')
	.service('i18n', ['$locale', '$interpolate', 'sysConfig', function ($locale, $interpolate) {
		angular.extend(this, {
			messages: {
			},

			addMessages: function () {
				var prefix = arguments[0];
				var messages = arguments[1];

				if(!messages) {
					messages = prefix;
				}

				if (!angular.isObject(messages)) {
					return;
				}

				for (var key in messages) {
					if (!messages.hasOwnProperty(key)) {
						continue;
					}

					var fullKey = key;
					if (angular.isString(prefix)) {
						fullKey = prefix + '.' + fullKey;
					}

					var msg = messages[key];

					if(angular.isObject(msg)) {
						this.addMessages(fullKey, msg);
					}

					if(angular.isString(msg)) {
						this.messages[fullKey] = msg;
					}
				}
			},

			msg: function (key, params) {
				if (!angular.isString(key)) {
					return '';
				}

				params = angular.isObject(params) ? params : { };

				var msg = this.messages[key];
				return msg ? $interpolate(msg)(params) : this.handleNotFound(key);
			},

			handleNotFound: function(key) {
				return '?' + key + '?';
			}
		});
	}])
	.filter('i18n', ['i18n', function (i18n) {
		return function (key, params) {
			return i18n.msg(key, params);
		};
	}]);