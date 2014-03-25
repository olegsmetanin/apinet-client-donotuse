define(['../moduleDef', 'angular'], function (module, angular) {
	module.factory('errorPageService', function() {

		var errorData = {
			reasonKey: null, //key for error in localization module
			reasonTitleKey: null, //key for error page title in localization module
			backState: null, //state before go to error page
			backStateParams: null
		};

		var backStateStack = [];

		return {
			setPrevState: function(prevState, prevStateParams) {
				//ignore abstract states and page.project state, that not abstract but abstract in reallity
				if (!prevState || !!prevState.abstract || prevState.name === 'page.project') return;

				//mem prev prev state, because prev state was throw error and we need go before thay
				var bs = { s: prevState, p: prevStateParams };
				backStateStack.push(bs);

				if (backStateStack.length > 2) {
					backStateStack.splice(0, 1);
				}

				errorData.backState = backStateStack[0].s;
				errorData.backStateParams = backStateStack[0].p;
			},

			setError: function(reason, title) {
				errorData.reasonKey = reason || null;
				errorData.reasonTitleKey = title || null;
			},

			getError: function() {
				return errorData;
			}
		}
	});

	module.run(['errorPageService', '$rootScope', function(svc, $rootScope) {
		$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
		   svc.setPrevState(from, fromParams);
		});
	}]);
});
