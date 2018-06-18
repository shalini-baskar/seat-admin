(function ($) {

	const ref = firebase.storage().ref();
	var rootRef = firebase.database().ref();
	var floors;
	var seats;
	var special = ['zeroth','first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth', 'fourteenth', 'fifteenth', 'sixteenth', 'seventeenth', 'eighteenth', 'nineteenth'];
	var deca = ['twent', 'thirt', 'fort', 'fift', 'sixt', 'sevent', 'eight', 'ninet'];

	//authentication start
	var email, password;
	
	

	$('.login').click(function() {
		email =  $('.email').val();
		password = $('.password').val();
  
		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
			  // Handle Errors here.
			 // var errorCode = error.code;
			  var errorMessage = error.message;
			  if(errorMessage) {
				  alert(errorMessage);
			  }
		});
	});

	firebase.auth().onAuthStateChanged(function(user) {
			if (user) {
		
				$('.logout-container').show();
				$('.login-container').hide(); 
			}
			else {
				$('.login-container').show(); 
			}
	});

	// logout
	$('.logout').click(function() {
	firebase.auth().signOut().then(function() {
		$('.logout-container').hide();
		$('.login-container').show(); 
	}).catch(function(error) {
		alert(error);
	}); 
	}); 

	//authentication end

    $('.submit-block').on('click',function(){
    	var floor_count = $('#floor-count').val();
    	var seat_count = $('#seat-count').val();
    	console.log(floor_count +' '+ seat_count)
    	firebase.database().ref('block').set({floor: floor_count, seat:seat_count});
    	
    });

	var floor_counts = []; 
	var seat_nos = [];
	var data;
	var currentFloor;
    firebase.database().ref('/Floors').once('value').then(function(snapshot) {
		data = snapshot.val();
		floor_counts = []; 
		snapshot.forEach(function(childSnapshot) {
			
			var item = childSnapshot.val();
			item.key = childSnapshot.key;
			floor_counts.push(item.key);	
			// get seat nos
		});
		// append floor
		$('#floor-value').html('<option selected>Choose Floor...</option>');
		floor_counts.forEach(function(entry) {
			$('#floor-value').append($('<option>', { value: entry, text: entry }));
		});

		$('#floor-value').on('change',function(){
			$('#seat-value').html('<option selected>Seat Value...</option>');
			currentFloor = $(this).val();
			setSeat(data[currentFloor])
		});

		function setSeat(childsnap){
			seat_nos = [];
			$.each(childsnap,function(key){
				seat_nos.push(key);
			});
			
			seat_nos.forEach(function(entry) {
				$('#seat-value').append($('<option>', { value: entry, text: entry }));
			});
		}
		$('#seat-value').on('change',function(){
			var seat = $(this).val();
			var details = data[currentFloor][seat];

			$('#username').val(details['details'].name);
			$('#email').val(details['details'].email);
			$('#mobile').val(details['details'].mobile);
			$('#department').val(details.department);
			$('#url').val(details['details'].url);
			$('#skypeid').val(details['details'].skypeid);
			//console.log($('#department').val(details.classification))
			//console.log(data[currentFloor][seat])
		});
		// append seat
		
	});
    	
	//validation start
	var username, email, mobile, department, url, skypeid, classification;
	var validityError = false;


	function emailChecking(email) {
		var re = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/igm;
		if (re.test(email)) {
			$('#email-error').remove();
		} else {
			$('#email-error').remove();
			$('#email').parent().append('<p class="error-msg" id="email-error">enter valid email address</p>');
		}	
	}

	function urlChecking(url) {
		var myVariable = url;
		   if(/^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i.test(myVariable)) {
			 $('#url-error').remove();
		   } else {
			   $('#url-error').remove();
			   $('#url').parent().append('<p class="error-msg" id="url-error">enter valid url</p>');
		   }   
	   }

	//submiting data
    $('.assign-user').on('click',function() {

		email = $('#email').val();
		username = $('#username').val();
		mobile = $('#mobile').val();
		department = $('#department').val(); 
		url = $('#url').val();
		skypeid = $('#skypeid').val();
	    var seat_no = $('#seat-value').val();
		var floor_no = $('#floor-value').val();
		
		$('.error-msg').remove();

		// checking input fiels
		$('.user-data').each(function() {
			var data = $(this).val();
			emailChecking(email);
			urlChecking(url);
			if( data.length < 5 ){
				$(this).parents('.form-group').append('<p class="error-msg">Please enter maximum 5 letters</p>');
			}
		});

		// checking floor dropdown
		$('.floor-select').each(function() {
			var val = $(this).val();
			if ( val.length > 5) {
				$(this).parents(".mb-3").after('<p class="error-msg">Please select</p>');
			}
		});

		//check for errors
		 var errors = false;
		$('.form-group').each(function() {
			if(	$(this).children().hasClass('error-msg') ) {
				errors = true;
			}
		});	 


		// insert date into firebase
		  if( !errors ) {
			console.log("submitted");
			firebase.database().ref('/Floors/' + floor_no + '/' + seat_no +'/details/').set({email: email, name: username, mobile: mobile, department: department, url: url, skypeid: skypeid});
		} 
 
});


	function stringifyNumber(n) {
	  if (n < 20) return special[n];
	  if (n%10 === 0) return deca[Math.floor(n/10)-2] + 'ieth';
	  return deca[Math.floor(n/10)-2] + 'y-' + special[n%10];
	}
	
})(jQuery);

