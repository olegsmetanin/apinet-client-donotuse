angular.module('core')
	.service("dictionaryService", ['apinet', 'helpers', function ($apinet, $helpers) {
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
							field: requestData.sortProps[i]
						});
					}
				}

				return $apinet.getModels({
					modelType: requestData.modelType,
					filter: filter,
					sorters: sorters,
					page: requestData ? parseInt(requestData.page, 10) : 0,
					pageSize: this.pageSize
				}, function(rows) {
					var result = [];
					for(var i = 0; i < rows.length; i++) {
						result.push({
							id: rows[i].Id,
							text: rows[i].Description
						});
					}
					return result;
				});
			},

			lookupCustomPropertyTypes: function (requestData) {
				return this.lookupModels(angular.extend({
					modelType: 'AGO.Docstore.Model.Dictionary.CustomPropertyTypeModel',
					filterProps: ['FullName'],
					sortProps : ['FullName']
				}, requestData));
			}
		});
	}]);