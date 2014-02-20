define(['../moduleDef', 'angular', 'require', 'module'], function (module, angular, require, requireModule) {
	var config = requireModule.config() || { globalRequire: require };
	var globalRequire = config.globalRequire;

	module.service('i18n', ['$interpolate', '$rootScope', '$injector', function ($interpolate, $rootScope, $injector) {
		$rootScope.i18n = {
			msg: function (key, params) {
				if (!angular.isString(key)) {
					return '';
				}

				var msg = $rootScope.i18n[key];
				return angular.isString(msg) ? (params ? $interpolate(msg)(params) : msg) : (angular.isObject(msg) ?
					$interpolate(key)(msg) : $rootScope.i18n.handleNotFound(key));
			},

			handleNotFound: function(key) {
				return config.release ? '' : '?' + key + '?';
			}
		};


		angular.extend(this, {
			locale: config.locale || 'en',
			supportedLocales: ['en','ru'],
			localizationModules: { },

			registerLocalizationModule: function(localizationModule) {
				this.localizationModules[localizationModule] = null;
			},

			addMessages: function (prefix, messages) {
				if(!prefix || !prefix.length || !angular.isObject(messages)) {
					return;
				}

				$rootScope.i18n[prefix] = messages;

				for (var key in messages) {
					if (!messages.hasOwnProperty(key)) {
						continue;
					}

					var fullKey = prefix + '.' + key;
					var msg = messages[key];

					if(angular.isObject(msg)) {
						this.addMessages(fullKey, msg);
					}

					if(angular.isString(msg)) {
						$rootScope.i18n[fullKey] = msg;
					}
				}
			},

			setLocale: function(locale) {
				var me = this;
				locale = locale || me.locale;

				var key;
				if(locale !== me.locale) {
					me.locale = locale;
					globalRequire.undef('i18n');
					globalRequire.config({
						config: {
							'i18n': {
								locale: locale
							}
						}
					});

					for(key in me.localizationModules) {
						if(!me.localizationModules.hasOwnProperty(key)) {
							continue;
						}
						globalRequire.undef('i18n!' + key);						
					}
				}
				
				var initLocalizationModule = function(moduleName) {
					require(['i18n!' + moduleName], function() {
						me.localizationModules[moduleName] = locale;

						var serviceName = moduleName + '/' + locale;

						if(!$injector.has(serviceName)) {
							return;
						}
						var service = $injector.get(serviceName);

						if(angular.isFunction(service)) {
							service();
						}

						if (!$rootScope.$$phase) {
							$rootScope.$apply();
						}
					});
				};

				for(key in me.localizationModules) {
					if(!me.localizationModules.hasOwnProperty(key)) {
						continue;
					}

					if(me.localizationModules[key] === locale) {
						continue;
					}

					initLocalizationModule(key);
				}

				return me.locale;
			},

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