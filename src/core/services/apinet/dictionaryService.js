angular.module('core')
	.service('dictionaryService', ['apinetService', 'helpers', function ($apinetService, $helpers) {
		angular.extend(this, {
			pageSize: 10,

			lookupModels: function (requestData) {
				var filter = {
					op: '&&',
					items: [ ]
				};

				var i;
				var term = $helpers.trim(requestData.term);
				if(term && angular.isArray(requestData.filterProps)) {
					for(i = 0; i < requestData.filterProps.length; i++) {
						filter.items.push({
							path: 'FullName',
							op: 'like',
							value: term
						});
					}
				}

				var sorters = [ ];
				if(angular.isArray(requestData.sortProps)) {
					for(i = 0; i < requestData.sortProps.length; i++) {
						sorters.push({
							property: requestData.sortProps[i]
						});
					}
				}

				return $apinetService.getModels({
					method: requestData ? requestData.method : null,
					filter: filter,
					sorters: sorters,
					page: requestData ? parseInt(requestData.page, 10) : 0,
					pageSize: this.pageSize
				});
			},

			lookupCustomPropertyTypes: function (requestData) {
				return this.lookupModels(angular.extend({
					method: 'core/dictionary/getCustomPropertyTypes',
					filterProps: ['FullName'],
					sortProps : ['FullName']
				}, requestData));
			},

			getCustomPropertyType: function (id) {
				return $apinetService.getModel({
					method: 'core/dictionary/getCustomPropertyType',
					id: id,
					cacheable: true,
					dontFetchReferences: true
				});
			}
		});
	}]);