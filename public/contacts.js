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
			.when('/add', {
				templateUrl: 'partials/add.html',
				controller: 'AddCtrl'
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
	.controller('EditCtrl', function ($scope, $routeParams, Contact, $http, $location, $timeout) {
		$scope.contact = Contact.get({name: $routeParams.name});
		var timeoutPromise;

		/**
		 * TODO: Cache whatever DOM element called save() and after the $location operations
		 * 		 have focus set on it.  Rewatch video to get why he can keep typing.
		 */

		$scope.save = function() {
			$timeout.cancel(timeoutPromise);

			timeoutPromise = $timeout(function() {
				$http.put('/api/contacts/' + $routeParams.name, $scope.contact);
				var newClean = ($scope.contact.name.first + '-' + $scope.contact.name.last).toLowerCase();
				$location.path('/contact/' + newClean).replace();	
			}, 1000);
		};
	})
	.controller('AddCtrl', function ($scope, Contact, $http, $location) {
		// Is there any way to avoid doing this?
		$scope.contact = {
			name: {first: 'John', last: 'Doe'},
			email: 'ok@go.com',
			phone: '35235235'
		};
		
		$scope.save = function() {
			var req = { 
				name: { first: $scope.contact.name.first , last: $scope.contact.name.last},
				email: $scope.contact.email,
				phone: $scope.contact.phone
			};

			$http.post('/api/contacts/', req);
			$location.path('/');
		};	
	})
	.controller('DeleteCtrl', function ($routeParams, $location, $http) {
		$http.delete('/api/contacts/' + $routeParams.name);
		$location.path('/').replace();
	})
	.controller('TableCtrl', function ($scope, Contact) {
		$scope.contacts = Contact.query();
	});