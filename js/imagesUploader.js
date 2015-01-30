//firebase rootref
rootRef = new Firebase('https://yopisode-event.firebaseio.com');

// management of the cover image of the event
        function previewFile(){
               var preview = document.getElementById('preview'); //selects the query named img
               var file    = document.getElementById('file').files[0]; //sames as here
               var reader  = new FileReader();
               reader.onloadend = function () {
                  preview.src = reader.result;
                  content = reader.result;
                  //here we get the last added event information
                  rootRef.child('Events').on('child_added', function(snapshot) {
                    eventKey = snapshot.key();
                  });
                  //et on store limage de levent

                  rootRef.child('Events').child(eventKey).update(
                  {
                    coverUrl: content,
                    id: eventKey
                  });
               }

               if (file) {
                   reader.readAsDataURL(file); //reads the data as a URL

               } else {
                preview.src = "";
               }
            }

        previewFile();