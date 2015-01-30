'use strick';

var yopService = angular.module('yopService', ['firebase']);
	
	yopService.service('appService', function(FBURL, $firebase) {
			var rootRef = new Firebase(FBURL).child('Users');
			var fireUsers = $firebase(rootRef);
			return {
				childAdded: function childAdded(cb) {
					fireUsers.on('child_added', function(snapshot) {
						var user = snapshot.val();
						cb.call(this, {
							id: user.name(),
							//events: user.events.numChildren()
						});
					})
				},

				checkUserExistance: function isUserExist(userId) {
					fireUsers.on('value', function(snapshot) {
						if(snapshot.hasChild('userId')){
							return true;
						}else{
							return false; 
						}
					});
				},

				add: function addUser(id, newUser) {
					return fireUsers.$add(newUser);
				}
			}
		});
