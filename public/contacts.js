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
	.controller('EditCtrl', function ($scope, $resource, $routeParams) {
		$scope.contact = $resource('/api/contacts/:name', {name: '@clean'}).get({name: $routeParams.name});

		// $save is part of angular
		$scope.save = function() {
			$scope.contact.$save(function(updatedContact) {
				$scope.contact = updatedContact;
			});
		};
	})
	.controller('TableCtrl', function ($scope, $resource) {
		$scope.contacts = $resource('/api/contacts', {name: '@clean'}).query();
	});

	// Add name: '@clean' to populate that property when posting. @ means it will be
	//           populated automatically.