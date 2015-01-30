'use strick';

//this is the module managing all the controller of the app

var yopCtrl = angular.module('yopCtrl', []);

	// First controller managing events
	//Dispalying, deleting, and so on

	yopCtrl.controller('eventsCtrl', ['$scope', function($scope) {
	  $scope.testevents = 'events working';
	  $scope.name = 'Nikki';
	  
	}]);

	// Second controller manging a signle event
	// deleting, editing, deleting etc..
	yopCtrl.controller('eventCtrl', ['$scope', function($scope) {
	  $scope.testevent = 'event working';
	  $scope.name = 'Mattie';
	  
	}]);

	//Third controller managing all the contents of the app
	yopCtrl.controller('contentsCtrl', ['$scope', function($scope) {
	  $scope.testcontents = 'contents working';
	  $scope.name = 'Gingerbread Baby';
	  
	}]);