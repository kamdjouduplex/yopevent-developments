'use strick';

// This is the module manging alll the Routing system of the app
var yopconfig = angular.module('yopconfig', ['ngRoute']);

	//yopconfig.constant('FBURL', 'https://yopisode-event.firebaseio.com/Users');

	yopconfig.config(['$routeProvider', function($routeProvider) {
		$routeProvider
			.when('/',{
				templateUrl: 'home.html',
				controller:  'yopeventCtrl'
			})
			.when('/events', {
				templateUrl: 'views/events.html',
				controller:  'eventsCtrl'
			})
			.when('/event/:id', {
				templateUrl: 'views/event.html',
				controller:  'eventCtrl'
			})
            .when('/editevent', {
				templateUrl: 'views/editevent.html',
				controller:  'eventCtrl'
			})
			.when('/editprofile', {
				templateUrl: 'views/editprofile.html',
				controller:  'eventCtrl'
			})
			.when('/profile', {
				templateUrl: 'views/profile.html',
				controller:  'eventCtrl'
			})
			.when('/page-not-found', {
				templateUrl: 'views/404.html',
				controller:  'contentsCtrl'
			})
			.when('/contents/about-us', {
				templateUrl: 'views/contents/about.html',
				controller:  'contentsCtrl'
			})
			.when('/contents/contact-us', {
				templateUrl: 'views/contents/contact.html',
				controller:  'contentsCtrl'
			})
			.when('/contents/partner', {
				templateUrl: 'views/contents/partner.html',
				controller:  'contentsCtrl'
			})
			.otherwise({ redirectTo: '/page-not-found' });

			// use the HTML5 History API
        //$locationProvider.html5Mode(true);
	}]);

