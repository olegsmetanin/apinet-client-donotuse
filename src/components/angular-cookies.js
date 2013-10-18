/**
 * @license AngularJS v1.1.5
 * (c) 2010-2012 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function (window, angular, undefined) {
	'use strict';

	/**
	 * @ngdoc overview
	 * @name ngCookies
	 */

	angular.module('ngCookies', ['ng'])
	/**
	 * @ngdoc object
	 * @name ngCookies.$cookies
	 * @requires $browser
	 *
	 * @description
	 * Provides read/write access to browser's cookies.
	 *
	 * Only a simple Object is exposed and by adding or removing properties to/from
	 * this object, new cookies are created/deleted at the end of current $eval.
	 *
	 * @example
	<doc:example>
	<doc:source>
	<script>
	function ExampleController($cookies) {
		// Retrieving a cookie
		var favoriteCookie = $cookies.myFavorite;
		// Setting a cookie
		$cookies.myFavorite = 'oatmeal';
	}
	</script>
	</doc:source>
	</doc:example>
	 */
		.factory('$cookies', ['$rootScope', '$browser', function ($rootScope, $browser) {
			var cookies = {},
				lastCookies = {},
				lastBrowserCookies,
				runEval = false,
				copy = angular.copy,
				isUndefined = angular.isUndefined;

			//creates a poller fn that copies all cookies from the $browser to service & inits the service
			$browser.addPollFn(function () {
				var currentCookies = $browser.cookies();
				if (lastBrowserCookies !== currentCookies) { //relies on browser.cookies() impl
					lastBrowserCookies = currentCookies;
					copy(currentCookies, lastCookies);
					copy(currentCookies, cookies);
					if (runEval) $rootScope.$apply();
				}
			})();

			runEval = true;

			//at the end of each eval, push cookies
			//TODO: this should happen before the "delayed" watches fire, because if some cookies are not
			//      strings or browser refuses to store some cookies, we update the model in the push fn.
			$rootScope.$watch(push);

			return cookies;


			/**
			 * Pushes all the cookies from the service to the browser and verifies if all cookies were stored.
			 */
			function push() {
				var name,
					value,
					browserCookies,
					updated;

				//delete any cookies deleted in $cookies
				for (name in lastCookies) {
					if (isUndefined(cookies[name])) {
						$browser.cookies(name, undefined);
					}
				}

				//update all cookies updated in $cookies
				for (name in cookies) {
					value = cookies[name];
					if (!angular.isString(value)) {
						if (angular.isDefined(lastCookies[name])) {
							cookies[name] = lastCookies[name];
						} else {
							delete cookies[name];
						}
					} else if (value !== lastCookies[name]) {
						$browser.cookies(name, value);
						updated = true;
					}
				}

				//verify what was actually stored
				if (updated) {
					updated = false;
					browserCookies = $browser.cookies();

					for (name in cookies) {
						if (cookies[name] !== browserCookies[name]) {
							//delete or reset all cookies that the browser dropped from $cookies
							if (isUndefined(browserCookies[name])) {
								delete cookies[name];
							} else {
								cookies[name] = browserCookies[name];
							}
							updated = true;
						}
					}
				}
			}
		}])
		.factory('$cookiesExt', ['$document', function ($document) {
			return (function () {
				function cookieFun(key, value, options) {

					var cookies,
						list,
						i,
						cookie,
						pos,
						name,
						hasCookies,
						all,
						expiresFor;

					options = options || {};

					if (value !== undefined) {
						// we are setting value
						value = typeof value === 'object' ? JSON.stringify(value) : String(value);

						if (typeof options.expires === 'number') {
							expiresFor = options.expires;
							options.expires = new Date();
							// Trying to delete a cookie; set a date far in the past
							if (expiresFor === -1) {
								options.expires = new Date('Thu, 01 Jan 1970 00:00:00 GMT');
								// A new
							} else {
								options.expires.setDate(options.expires.getDate() + expiresFor);
							}
						}
						return ($document[0].cookie = [
							encodeURIComponent(key),
							'=',
							encodeURIComponent(value),
							options.expires ? '; expires=' + options.expires.toUTCString() : '',
							options.path ? '; path=' + options.path : '',
							options.domain ? '; domain=' + options.domain : '',
							options.secure ? '; secure' : ''
						].join(''));
					}

					list = [];
					all = $document[0].cookie;
					if (all) {
						list = all.split("; ");
					}

					cookies = {};
					hasCookies = false;

					for (i = 0; i < list.length; ++i) {
						if (list[i]) {
							cookie = list[i];
							pos = cookie.indexOf("=");
							name = cookie.substring(0, pos);
							value = decodeURIComponent(cookie.substring(pos + 1));

							if (key === undefined || key === name) {
								try {
									cookies[name] = JSON.parse(value);
								} catch (e) {
									cookies[name] = value;
								}
								if (key === name) {
									return cookies[name];
								}
								hasCookies = true;
							}
						}
					}
					if (hasCookies && key === undefined) {
						return cookies;
					}
				}

				cookieFun.remove = function (key, options) {

					var hasCookie = cookieFun(key) !== undefined;
					if (hasCookie) {
						if (!options) {
							options = {};
						}
						options.expires = -1;
						cookieFun(key, '', options);
					}
					return hasCookie;
				};
				return cookieFun;
			}());
		}])
		/**
		* @ngdoc object
		* @name ngCookies.$cookieStore
		* @requires $cookies
		*
		* @description
		* Provides a key-value (string-object) storage, that is backed by session cookies.
		* Objects put or retrieved from this storage are automatically serialized or
		* deserialized by angular's toJson/fromJson.
		* @example
		*/
		.factory('$cookieStore', ['$cookies', function ($cookies) {

		return {
			/**
			 * @ngdoc method
			 * @name ngCookies.$cookieStore#get
			 * @methodOf ngCookies.$cookieStore
			 *
			 * @description
			 * Returns the value of given cookie key
			 *
			 * @param {string} key Id to use for lookup.
			 * @returns {Object} Deserialized cookie value.
			 */
			get: function (key) {
				var value = $cookies[key];
				return value ? angular.fromJson(value) : value;
			},

			/**
			 * @ngdoc method
			 * @name ngCookies.$cookieStore#put
			 * @methodOf ngCookies.$cookieStore
			 *
			 * @description
			 * Sets a value for given cookie key
			 *
			 * @param {string} key Id for the `value`.
			 * @param {Object} value Value to be stored.
			 */
			put: function (key, value) {
				$cookies[key] = angular.toJson(value);
			},

			/**
			 * @ngdoc method
			 * @name ngCookies.$cookieStore#remove
			 * @methodOf ngCookies.$cookieStore
			 *
			 * @description
			 * Remove given cookie
			 *
			 * @param {string} key Id of the key-value pair to delete.
			 */
			remove: function (key) {
				delete $cookies[key];
			}
		};

	}]);


})(window, window.angular);
