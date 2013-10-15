angular.module('core').run(['i18n', function(i18n) {
	i18n.addMessages('core', {
		'labels': {
			'yes': 'Yes',
			'no': 'No'
		},

		'buttons': {
			'cancel': 'Cancel',
			'clear': 'Clear',
			'apply': 'Apply',
			'save': 'Save',
			'load': 'Load',
			'delete': 'Delete',
			'edit': 'Edit',
			'more': 'More'
		},

		'fields': {
			'name': 'Name',
			'fullName': 'Full name',
			'description': 'Description',
			'type': 'Type',
			'creationTime': 'Creation time'
		},

		'sorting': {
			'ascending': 'Ascending',
			'descending': 'Descending'
		},

		'errors': {
			'title': 'Error',
			'unknown': 'Unknown error'
		},

		'confirm': {
			'delete': {
				'records': 'You really want to delete this records?'
			}
		},

		'menu' :{
			'user': {
				'currentUser': 'User',
				'profile': 'Profile',
				'messages': 'Messages',
				'reports': 'Reports',
				'system': 'System'
			}
		},

		'auth': {
			'credentials': {
				'legend': 'Please enter your login details',
				'email': 'E-mail',
				'password': 'Password'
			},
			'buttons': {
				'signIn': 'Sign in',
				'signOut': 'Sign out'
			},
			'reason': {
				'notAuthorized': 'You do not have the necessary access permissions.  Do you want to login as someone else?',
				'notAuthenticated': 'You must be logged in to access this part of the application.'
			},
			'errors': {
				'invalidCredentials': 'Login failed.  Please check your credentials and try again.',
				'serverError': 'There was a problem with authenticating: {{exception}}.'
			}
		},

		'filters': {
			'simple': 'Simple',
			'complex': 'Complex',
			'user': 'User',
			'favorites': 'Favorites',

			'ops': {
				'exists': 'EXISTS',
				'like': 'CONTAINS',
				'and': 'AND',
				'or': 'OR',

				'not': {
					'exists': 'NOT EXISTS',
					'like': 'NOT CONTAINS',
					'and': 'AND NOT'
				}
			},

			'buttons': {
				'newRootNode': 'Add root node',
				'rootNode': 'root node',
				'newNode': 'Add',
				'editNode': 'Edit',
				'deleteNode': 'Delete'
			},

			errors: {
				'unexpected': {
					op: 'No operator allowed for this node type',
					value: 'No value allowed for this node type',
					child: 'No child nodes allowed for this node type'
				},
				'missing': {
					'op': 'Operator is not specified',
					'value': 'Value is not specified'
				},
				'invalid': {
					'op': 'Invalid operator'
				},
				expected: {
					'guid': 'Value must be unique identifier (Guid)',
					'int': 'Value must be integer',
					'float': 'Value must be number',
					'bool': 'Value must be boolean',
					'date': 'Value must be valid date',
					'enum': 'Value must be in list of allowed values'
				}
			}
		},

		'application': {
			'creator': 'AGO Systems'
		}
	});
}]);