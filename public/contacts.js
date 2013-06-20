angular
	.module('contacts', ['ngResource'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/contact/:name', {
				templateUrl: 'partials/edit.html',
				controller: 'EditCtrl'
			})
			.when('/', {
				templateUrl: 'partials/table.html',
				controller: 'TableCtrl'
			});
		$locationProvider.html5Mode(true);
	})
	.factory('Contact', function($resource) {
		return $resource('/api/contacts/:name', {name: '@clean'});
	})
	.controller('EditCtrl', function ($scope, $resource, $routeParams, Contact) {
		$scope.contact = Contact.get({name: $routeParams.name});

		// $save is part of angular
		$scope.save = function() {
			$scope.contact.$save(function(updatedContact) {
				$scope.contact = updatedContact;
			});
		};
	})
	.controller('TableCtrl', function ($scope, $resource, Contact) {
		$scope.contacts = Contact.query();
	});

	// Add name: '@clean' to populate that property when posting. @ means it will be
	//           populated automatically.