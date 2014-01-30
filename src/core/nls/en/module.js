define(['../../moduleDef'], function (module) {
	module.run(['i18n', 'strapConfig', '$locale', function(i18n, strapConfig, $locale) {

		$locale.DATETIME_FORMATS.ago_date = "MM/dd/yyyy";
		$locale.DATETIME_FORMATS.ago_datetime = "MM/dd/yyyy HH:mm";
		$locale.DATETIME_FORMATS.ago_datelongtime = "MM/dd/yyyy HH:mm:ss";

		strapConfig.format = 'mm/dd/yyyy';

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
				'more': 'More',
				'refresh': 'Refresh'
			},

			'fields': {
				'name': 'Name',
				'fullName': 'Full name',
				'description': 'Description',
				'type': 'Type',
				'creationTime': 'Creation time',
				'lastChangeTime': 'Last changed',
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

				'placeholders': {
					'typeNode': 'Property type'
				},

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
					'expected': {
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
			},

			'reporting': {
				'selector': 'Reports',
				'title': 'Report generation',
				'report': 'Select report',
				'priority': {
					'title': 'Select priority type',
					'byUser': 'By project participant',
					'byDate': 'By date'
				},
				'result': 'Report file name (optional)',
				'run': 'Generate',
				'viewAll': 'View all reports',
				'running': 'Running reports',
				'unread': 'Unread reports',
				'position': 'Position in work queue',

				'templates': {
					'title': 'Report templates',
					'fields': {
						'size': 'File size'
					}
				},
				'reports': {
					'title': 'User reports',
					'fields': {
						'state': 'State',
						'startedAt': 'Started at',
						'completedAt': 'Completed at',
						'duration': 'Duration',
						'progress': 'Progress',
						'errorMsg': 'Error text',
						'errorDetails': 'Error details'
					},
					'duration': {
						'hours': {
							'one': 'hour',
							'few': 'hours',
							'many': 'hours',
							'other': 'hours'
						},
						'minutes': {
							'one': 'minute',
							'few': 'minutes',
							'many': 'minutes',
							'other': 'minutes'	
						},
						'seconds': 'sec'
					}
				}
			},

			'upload': {
				'placeholder': 'Drop files to upload here',
				'addFiles': 'Add files...'
			},

			'tags': {
				'addTag': 'Add new tag',
				'removeTag': 'Remove tag',
				'newTag': 'Enter new tag name'
			}
		});

		i18n.addMessages('projects', {
			'fields': {
				'code': 'Project code',
				'status': 'Status',
				'tags': 'Tags'
			},

			'list': {
				'title': 'Projects',
				'buttons': {
					'add': 'New project'
				},

				'filters': {
					'participation': {
						'label': 'Projects',
						'all': 'Any',
						'me': 'My'
					}
				}
			},
			'create': {
				'title': 'New project',
				'legend': 'Creating new project',
				'placeholders': {
					'type': 'Select project type'
				}
			},
			'statuses': {
				'title': 'Statuses dictionary',
				'buttons': {
					'add': 'New status'
				}
			},
			'tags': {
				'title': 'Tags dictionary',
				'placeholders': {
					'new': 'New tag'
				}
			}
		});
	}]);
});