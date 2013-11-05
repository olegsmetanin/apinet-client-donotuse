define(['angular', '../moduleDef'], function (angular, module) {
	module.service('i18n', ['$interpolate', '$rootScope', function ($interpolate, $rootScope) {
		$rootScope.i18n = {
			addMessages: function () {
				var prefix = arguments[0];
				var messages = arguments[1];

				if(!messages) {
					messages = prefix;
				}

				if (!angular.isObject(messages)) {
					return;
				}

				$rootScope.i18n[prefix] = messages;

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
						$rootScope.i18n.addMessages(fullKey, msg);
					}

					if(angular.isString(msg)) {
						$rootScope.i18n[fullKey] = msg;
					}
				}
			},

			msg: function (key, params) {
				if (!angular.isString(key)) {
					return '';
				}

				var msg = $rootScope.i18n[key];
				return angular.isString(msg) ? (params ? $interpolate(msg)(params) : msg) : (angular.isObject(msg) ?
					$interpolate(key)(msg) : $rootScope.i18n.handleNotFound(key));
			},

			handleNotFound: function(key) {
				return '?' + key + '?';
			}
		};


		angular.extend(this, {
			addMessages: $rootScope.i18n.addMessages,
			msg: $rootScope.i18n.msg,
			handleNotFound: $rootScope.i18n.handleNotFound
		});
	}])
	.filter('i18n', ['i18n', function (i18n) {
		return function (key, params) {
			return i18n.msg(key, params);
		};
	}]);
});