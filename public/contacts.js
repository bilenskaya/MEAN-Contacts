angular
	.module('contacts', ['ngResource'])
	.config(function($routeProvider, $locationProvider) {
		$routeProvider
			.when('/contact/:name', {
				templateUrl: 'partials/edit.html',
				controller: 'EditCtrl'
			})
			.when('/contact/:name/delete', {
				templateUrl: 'partials/edit.html',
				controller: 'DeleteCtrl'
			})
			.when('/', {
				templateUrl: 'partials/table.html',
				controller: 'TableCtrl'
			});
		$locationProvider.html5Mode(true);
	})
	.factory('Contact', function($resource) {
		// Add name: '@clean' to populate that property when POSTing. @ means it will be
		//           populated automatically.
		return $resource('/api/contacts/:name', {name: '@clean'});
	})
	.controller('EditCtrl', function ($scope, $resource, $routeParams, Contact, $http, $location) {
		$scope.contact = Contact.get({name: $routeParams.name});

		// $save is part of angular.  It is a method of $resource. 
		// New methods could be defined if you wanted to.
		$scope.save = function() {
			$http.post('/api/contacts/' + $routeParams.name, $scope.contact);
			var newClean = ($scope.contact.name.first + '-' + $scope.contact.name.last).toLowerCase();
			$location.path('/contact/' + newClean).replace();
		};
	})
	.controller('DeleteCtrl', function ($routeParams, $location, $http) {
		$http.delete('/api/contacts/' + $routeParams.name);
		$location.path('/').replace();
	})
	.controller('TableCtrl', function ($scope, $resource, Contact) {
		$scope.contacts = Contact.query();
	});