
var yopevent = angular.module('yopevent', 
			   [
			   		'yopconfig',
			   		'ngFacebook', 
			   		'firebase'
			   ]);

	yopevent.config(['$facebookProvider', function($facebookProvider) {
	    $facebookProvider
	    	.setAppId('945698975459525')
	    	.setPermissions(['email','user_friends']);
	  }]);

	//yopevent.constant('FBURL', 'https://yopisode-event.firebaseio.com/Users');
	
	

	yopevent.run(['$rootScope', '$window', function($rootScope, $window) {
	    (function(d, s, id) {
	      var js, fjs = d.getElementsByTagName(s)[0];
	      if (d.getElementById(id)) return;
	      js = d.createElement(s); js.id = id;
	      js.src = "//connect.facebook.net/en_US/sdk.js";
	      fjs.parentNode.insertBefore(js, fjs);
	    }(document, 'script', 'facebook-jssdk'));
	    $rootScope.$on('fb.load', function() {
	      $window.dispatchEvent(new Event('fb.load'));
	    });
	  }])

	rootRef = new Firebase('https://yopisode-event.firebaseio.com');

	yopevent.controller('yopeventCtrl', [
		'$scope', '$facebook', '$location', '$routeParams',
	 function($scope, $facebook,$location, $routeParams) {
	   	//initialy we hide the login/logout status
	   	$scope.state = false;

	   	/*
	   	/*here we call the facebook authentication to check your astatus 
	   	*/
	    $scope.$on('fb.auth.authResponseChange', function() {
	      $scope.status = $facebook.isConnected();
	    // after checking it we show now your login/logout status
	      $scope.state = true;
	    //now we check if your are connected 
	    //we call the api method to get the user boject
	      if($scope.status) {
	      	
	      	//get user basic information
	        $facebook.api('/me').then(function(user) {
	          $scope.user = user;
	          //make the user object global
	          userBoject = user;
	          //create a user object to store in the database
	          var User = {
	          	id: $scope.user.id,
	          	fb_name: $scope.user.name,
	          	yop_name: $scope.user.name,
	          	email: $scope.user.email,
	          	first_name: $scope.user.first_name,
	          	last_name: $scope.user.last_name,
	          	gender: $scope.user.gender,
	          	link: $scope.user.link,
	          	locale: $scope.user.locale
	          };
	          
	          
	          userId = $scope.user.id;
	          	rootRef.child('Users').on('value', function(snapshot) {
						if(snapshot.hasChild(userId)){
							return console.log('user exist'); 
						}else{
							rootRef.child('Users').child(userId).child('userInfos').set(User);
						}
					});
	      	});


	        // get a user friend list
	      	$facebook.cachedApi('/me/friends').then(function(friends) {
		        $scope.friends = friends.data;
		        rootRef.child('Users').child(userId).child('friends').update(friends.data);
		      });

	    }
	    });

		// we get the liste of all events here
		rootRef.child('Events').on('value', function(snapshot) {
			eventsObject = snapshot.val();
			
			$scope.allEvents = eventsObject;
			
		});

		/*$scope.singleEvent = function() {
	    	var eventId = $routeParams.id;
	    	console.log(eventId);
	    	console.log(eventsObject);
			$scope.clickedEvent = eventsObject.eventId;
		}*/

	    $scope.create = function() {
	    	var Event = {};	    	
	    	if($scope.status){
	    			var eventDate = $scope.startdate;
			    	var eventArray = eventDate.split("-");
			    	var month = eventArray[1];
			    	
			    	if(month == "01"){
			    		month = "Jan";
			    	}else if(month == "02") {
			    		month = "Feb";
			    	}else if(month == "03") {
			    		month = "Mar";
			    	}else if(month == "04") {
			    		month = "Apr";
			    	}else if(month == "05") {
			    		month = "May";
			    	}else if(month == "06") {
			    		month = "June";
			    	}else if(month == "07") {
			    		month = "July";
			    	}else if(month == "08") {
			    		month = "Aug";
			    	}else if(month == "09") {
			    		month = "Sept";
			    	}else if(month == "10") {
			    		month = "Oct";
			    	}else if(month == "11") {
			    		month = "Nov";
			    	}else {
			    		month = "Dec";
			    	}
			
		    Event = {
		    	user_id: userId,
				tv_program: $scope.tvprogram,
				spot: $scope.spot,
				eventYear: eventArray[0],
				eventMonth: month,
				eventday: eventArray[2],
				starttime: $scope.starttime,
				duration: $scope.duration,
				description: $scope.description,
				invitefriend: $scope.invitefriend,
				coverUrl: ''
			};
			
	    	
	    		rootRef.child("Events").push(Event);
	    		$('#myModal').modal('toggle');
	    		$location.path("/editevent");
	    		Event = {};
	    		
	    		//here we get the last added event information
	    		rootRef.child("Events").on('child_added', function(snapshot) {
	    			$scope.EventAdded = snapshot.val();
	    	
	    		});
	    	}else{
	    		$('#myModal').modal('toggle');
	    		$('#loginModal').modal('toggle');
	    	}
	    };

	    $scope.closemodal =function() {
	    	$('#loginModal').modal('toggle');
	    }

	    $scope.loginToggle = function() {
	      if($scope.status) {
	        $facebook.logout();
	      } else {
	        $facebook.login();
	      }
	    };

	    $scope.getFriends = function() {
	      if(!$scope.status) return;
	      $facebook.cachedApi('/me/friends').then(function(friends) {
	        $scope.friends = friends.data;
	        
	      });
	    }
	  }]);

	yopevent.controller('eventsCtrl', ['$scope', function($scope) {
		/*rootRef.child('Events').on('value', function(snapshot) {
			$scope.allEvents = snapshot.val();
		});*/
	}]);

	// Second controller manging a signle event
	// deleting, editing, deleting etc..
	yopevent.controller('eventCtrl', ['$scope', '$routeParams', function($scope, $routeParams) {
		var id = $routeParams.id;
		$scope.clickedEvent = eventsObject[id];

		/*
		/* this is to handled the join button 
		/* so that when the user clicked once it deactiveted the button
		*/
		$('#joinEvent').one('click', function() {
		    var joiner = {};
				joiner = {
					id: userBoject.id,
					name: userBoject.name
				};
			rootRef.child("Events").child(id).child("joiners").push(joiner);
		});
		
	}]);

	//Third controller managing all the contents of the app
	yopevent.controller('contentsCtrl', ['$scope', function($scope) {
	  $scope.testcontents = 'contents working';
	  $scope.name = 'Gingerbread Baby';
	  
	}]);
          


