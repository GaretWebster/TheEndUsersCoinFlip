var ref = new Firebase("https://enduserscoinflip.firebaseio.com/");
var path = window.location.pathname;
var page = path.split("/").pop();

var old_email;

ref.onAuth(function(authData) {
	var pathname = window.location.pathname;
	var p = pathname.split("/").pop();
	if (authData) {
        old_email = ref.getAuth().password.email;
		// user is already logged in, send them to wire2
		if( p == "index.html" || p == "register.html" || p == "login.html" ) {
			window.location = "wire2.html";
		}

	} else {
		// if user is not logged in and not on index, register, or login page, redirect to index page
		if( p != "index.html" && p != "register.html" && p != "login.html" ) {
			window.location = "index.html";
		}
	}
});


function authFacebook() {
    ref.authWithOAuthPopup("facebook", function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
        }
    });
}

function authGoogle() {
    ref.authWithOAuthPopup("google", function(error, authData) {
        if (error) {
            console.log("Login Failed!", error);
        } else {
            console.log("Authenticated successfully with payload:", authData);
        }
    });

}

function createUser() {
        
    var inputemail = document.getElementById("regemail").value;
    var inputpassword = document.getElementById("regpassword").value;
    
    mixpanel.track("Register", {"User": inputemail});
    
    ref.createUser({
    	email    : inputemail,
    	password : inputpassword
    }, function(error, authData) {
    	if (error) {
    		document.getElementById("alert").innerHTML = error;
    	} else {
    		document.getElementById("alert").innerHTML = "Successfully registered with the email address: " + inputemail + "!<br>" + '<a href="login.html">Click here to log in.<svg class="icon icon-play-arrow"> <symbol id="icon-play-arrow2" viewBox="0 0 1024 1024"><title>play-arrow</title>                                 <path class="path1" d="M341.333 213.333v597.333l469.333-298.667z"></path>                                </symbol>                                <use xlink:href="#icon-play-arrow2"></use>   </svg></a>';
    		document.getElementById('register-div').style.display = 'none';
   		}
    });
}

function loginUser() {
	var inputemail = document.getElementById("regemail").value;
    var inputpassword = document.getElementById("regpassword").value;
    
    mixpanel.track("Log in", {"User": inputemail});

    ref.authWithPassword({
		email    : inputemail,
		password : inputpassword
    }, function(error, authData) {
		if (error) {
			document.getElementById("alert").innerHTML = error;
		} else {
			document.getElementById("alert").innerHTML = "Log in successful!";
			document.getElementById('register-div').style.display = 'none';

			window.location = "wire2.html";
		}});
}

function pressEnter(method) {
	if (event.keyCode == 13) {

		if(method == "register") {
			createUser();
		}
		else if(method == "login") {
			loginUser();
		}
		else if(method == "additem") {

		}

	}

}


function updateEmail() {

    var new_email = document.getElementById("e_user_email").value;
    var old_password = document.getElementById("e_user_password").value;

    ref.changeEmail({
        oldEmail : old_email,
        newEmail : new_email,
        password : old_password
    }, function(error) {
        if (error === null) {
            document.getElementById("e_update_alert").innerHTML = "Success!";
            old_email = new_email;
            console.log("Email changed successfully");
        } else {
            document.getElementById("e_update_alert").innerHTML = error;
            console.log("Error changing email:", error);
        }
    });
}


function updatePassword() {

    var old_password = document.getElementById("p_user_password").value;
    var new_password = document.getElementById("p_user_new_password").value;


    ref.changePassword({
        email       : old_email,
        oldPassword : old_password,
        newPassword : new_password
    }, function(error) {
        if (error === null) {
            document.getElementById("p_update_alert").innerHTML = "Success!";
            console.log("Password changed successfully");
        } else {
            document.getElementById("p_update_alert").innerHTML = error;

            console.log("Error changing password:", error);
        }
    });

}


function saveToStack() {
    var authData = ref.getAuth();

    if (authData) {
        var idx = window.location.href.indexOf('#');
        var input_img_hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
        var input_metal = document.getElementById("form_metal").value;
        var x = document.getElementById("form_type");
        var input_type = x.options[x.selectedIndex].text;            
        var input_purchase_date = document.getElementById("form_purchase_date").value;
        var input_quantity = document.getElementById("form_quantity").value;
        var input_premium = document.getElementById("form_premium").value;
        var input_unit_price = document.getElementById("form_unit_price").value;
        
        if(!input_purchase_date) {
            alert("Please enter a purchase date!");
        }
        else if(!input_quantity){
            alert("Please enter a quantity!");
        }
        else if(!input_premium) {
            alert("Please enter a premium!");
        }
        else if(!input_unit_price) {
            alert("Please enter a unit price!");
        }
        else {
            mixpanel.track("Save to Stack", {"User": authData.uid, "Metal": input_metal,
                           "Type" : input_type,
                           "Purchase Date" : input_purchase_date,
                           "Quantity": input_quantity,
                           "Premium": input_premium,
                           "Unit Price": input_unit_price});

            ref.child("users").child(authData.uid).push({
                img_hash: input_img_hash,
                metal: input_metal,
                type: input_type,
                purchase_date: input_purchase_date,
                quantity: input_quantity,
                premium: input_premium,
                unit_price: input_unit_price,
                percent: "0.999",
                weight_unit_g: "1.244",
                gu: "1.244",
                ozt_u: "0.0400",
                total_au: "0.0400",
                total: input_quantity * input_unit_price * .999 + parseInt(input_premium) 
            });  
        
            if(input_metal == "gold")
				window.location = "wire3.html";
			else if(input_metal == "silver")
				window.location = "wire6.html";
			else if(input_metal == "platinum")
				window.location = "wire7.html";
        }
    }            
}



window.onload = function() {
if(page == "wire4.html") {
	var itemkey = window.location.hash.substr(1);
    
    var authData = ref.getAuth();
    qref = ref.child("users");
    qref.child(authData.uid).child(itemkey).once("value", function(snapshot) {

        var f = new Firebase(ref + '/pano/' + snapshot.val().img_hash + '/filePayload');
        f.once('value', function(snap) {
            var payload = snap.val();
            if (payload != null) {
                document.getElementById("img_circle").style.display = "none";
                document.getElementById("img_box").style.backgroundImage = "url(\'" + payload + "\')";
            }

        });


        document.getElementById('td_metal').innerHTML = snapshot.val().metal.charAt(0).toUpperCase() + snapshot.val().metal.substring(1);
        document.getElementById('td_type').innerHTML = snapshot.val().type;
        document.getElementById('td_purchase_date').innerHTML = snapshot.val().purchase_date;
        document.getElementById('td_quantity').innerHTML = snapshot.val().quantity;
        document.getElementById('td_premium').innerHTML = snapshot.val().premium;
        document.getElementById('td_unit_price').innerHTML = snapshot.val().unit_price;
        document.getElementById('td_percent').innerHTML = snapshot.val().percent;
        document.getElementById('td_weight_unit_g').innerHTML = snapshot.val().weight_unit_g;
        document.getElementById('td_gu').innerHTML = snapshot.val().gu;
        document.getElementById('td_ozt_u').innerHTML = snapshot.val().ozt_u;
        document.getElementById('td_total_au').innerHTML = snapshot.val().total_au;
        document.getElementById('td_total').innerHTML = snapshot.val().total;
      
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });    
}
else if(page == "wire2.html" || page == "wire3.html" || page == "wire6.html" || page == "wire7.html") {


	var authData = ref.getAuth();
    qref = ref.child("users");

    qref.child(authData.uid).once("value", function(snapshot) {

        var totalvalue = 0.0;
        
        snapshot.forEach(function(childSnapshot) {
          //  console.log("TEST" + childSnapshot.val().metal);
          
            var entry = childSnapshot.val()
            
            if((page == "wire3.html" && entry.metal=="gold") || (page == "wire6.html" && entry.metal=="silver") || (page == "wire7.html" && entry.metal=="platinum")) {
                var tableRef = document.getElementById('metal_table').getElementsByTagName('tbody')[0];
                var row = tableRef.insertRow(-1);
                row.setAttribute('id', childSnapshot.key());
                var image = row.insertCell(-1);
                image.setAttribute('class', "stack_img_col");
                var item = row.insertCell(-1);
                var qty = row.insertCell(-1);
                var weight = row.insertCell(-1);
                var percent = row.insertCell(-1);
                var value = row.insertCell(-1);

                var f = new Firebase(ref + '/pano/' + entry.img_hash + '/filePayload');
                f.once('value', function(snap) {
                    var payload = snap.val();
                    if (payload != null) {
                        image.innerHTML = '<div class="coin_mini" style="background-image:url('+ payload + ');background-size:100% 100%;"></div>';

                    }
                    else {
                        image.innerHTML = '<div class="coin_mini"></div>';
                    }
                });

                image.innerHTML = '<div class="coin_mini"></div>';
                item.innerHTML = entry.type;
                qty.innerHTML = entry.quantity;
                weight.innerHTML = entry.weight_unit_g;
                percent.innerHTML = entry.percent;
                value.innerHTML = entry.total;
                
                // add the entry's key to the link
                row.setAttribute('onclick', "window.document.location='wire4.html#" + childSnapshot.key()+"'");
                
                totalvalue += +entry.total;
                
            }
            else if(page == "wire2.html") {
            	totalvalue += +entry.total;
            }
        });

        totalvalue = parseFloat(totalvalue).toFixed(2);
        document.getElementById("totalvalue").innerHTML = "$" + totalvalue;

      
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });  
}};














if(page == "wire5.html") {


    var spinner = new Spinner({color: '#ddd'});
    var firebaseRef = 'https://enduserscoinflip.firebaseio.com/';


    function handleFileSelect(evt) {
        var f = evt.target.files[0];
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                var filePayload = e.target.result;
                // Generate a location that can't be guessed using the file's contents and a random number
                var hash = CryptoJS.SHA256(Math.random() + CryptoJS.SHA256(filePayload));
                var f = new Firebase(firebaseRef + 'pano/' + hash + '/filePayload');
                spinner.spin(document.getElementById('spin'));
                // Set the file payload to Firebase and register an onComplete handler to stop the spinner and show the preview
                f.set(filePayload, function() { 
                    spinner.stop();
                    console.log(e.target.result);
                    document.getElementById("img_circle").style.display = "none";
                    document.getElementById("img_box").style.backgroundImage = "url(\'" + e.target.result + "\')";
                    // Update the location bar so the URL can be shared with others
                    window.location.hash = hash;
                });
            };
        })(f);
        reader.readAsDataURL(f);
    }

    $(function() {
        $('#spin').append(spinner);

        var idx = window.location.href.indexOf('#');
        var hash = (idx > 0) ? window.location.href.slice(idx + 1) : '';
        if (hash === '') {
            document.getElementById("file-upload").addEventListener('change', handleFileSelect, false);
        }
        else {
            // A hash was passed in, so let's retrieve and render it.
            spinner.spin(document.getElementById('spin'));
            var f = new Firebase(firebaseRef + '/pano/' + hash + '/filePayload');
            f.once('value', function(snap) {
                var payload = snap.val();
                if (payload != null) {
                    document.getElementById("img_circle").style.display = "none";
                    document.getElementById("img_box").style.backgroundImage = "url(\'" + payload + "\')";
                }
                else {
                    $('#body').append("Not found");
                }
                spinner.stop();
            });
        }
    });
    
}
