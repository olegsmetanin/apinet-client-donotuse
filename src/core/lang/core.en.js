angular.module('core').run(['i18n', '$strapConfig', '$locale', function(i18n, $strapConfig, $locale) {

	$locale.DATETIME_FORMATS.ago_date = "MM/dd/yyyy";
	$locale.DATETIME_FORMATS.ago_datetime = "MM/dd/yyyy HH:mm";

	$strapConfig.format = 'mm/dd/yyyy';

	i18n.addMessages('core', {
		'roles': {
			'title': 'Roles ({{role}})',
			'admin': 'Admin',
			'nothing': 'nothing'
		},

		'locale': {
			'label': 'Language',
			'ru': 'Russian',
			'en': 'English'
		},

		'labels': {
			'yes': 'Yes',
			'no': 'No',
			'loading': 'Loading',
			'presentTime': 'present time',
			'none': 'None'
		},

		'placeholders': {
			'replacementItem': 'Substitute existing references with: (optional)'
		},

		'buttons': {
			'cancel': 'Cancel',
			'clear': 'Clear',
			'apply': 'Apply',
			'save': 'Save',
			'add': 'Add',
			'new': 'New',
			'load': 'Load',
			'delete': 'Delete',
			'deleteSelected': 'Delete selected',
			'edit': 'Edit',
			'more': 'More'
		},

		'fields': {
			'name': 'Name',
			'fullName': 'Full name',
			'description': 'Description',
			'type': 'Type',
			'creationTime': 'Creation time',
			'creator': 'Author',
			'viewOrder': 'Seq.#',

			'customProperties': {
				'type': 'Parameter',
				'value': 'Value'
			}
		},

		'sorting': {
			'ascending': 'Ascending',
			'descending': 'Descending'
		},

		'errors': {
			'title': 'Error',
			'unknown': 'Unknown error',
			'integerInRange': 'Must be integer in range {{range}}',
			'requiredField': 'Required field',
			'nothingToDelete': 'Record for deletion not found (refresh page)'
		},

		'confirm': {
			'delete': {
				'records': 'Are you really want to delete this records?',
				'record': 'Are you really want to delete this record?'
			}
		},

		'menu' :{
			'user': {
				'currentUser': 'User',
				'profile': 'Profile',
				'messages': 'Messages',
				'reports': 'Reports',
				'system': 'System'
			},
			'dictionaries': 'Dictionaries'
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
			'title': 'Filter',
			'simple': 'Simple',
			'complex': 'Complex',
			'user': 'Props',
			'favorites': 'Favorites',
			'displayedRecords': 'Currently showing: {{ count }} records',
			'applyRequired': 'Apply filter changes for records display',

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

			'errors': {
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
			'creator': 'Company',
			'landing': 'Company'
		},

		'profile': {
			'title': 'User profile',
			'personalInfo': 'Personal info',
			'personalInfoDesc': 'Proin eu nibh ut urna tristique rhoncus. Sed euismod, quam sed dignissim imperdiet, nulla leo vehicula mi, a sagittis lacus augue nec sapien.',
			'settings': 'Settings',
			'settingsDesc': 'Personal applicaton settings',
			'fields': {
				'firstName': 'First name'
			}
		}
	});
}]);