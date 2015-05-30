var ref = new Firebase("https://enduserscoinflip.firebaseio.com");


ref.onAuth(function(authData) {
	var path = window.location.pathname;
	var page = path.split("/").pop();
	if (authData) {
		// user is already logged in, send them to wire2
		if( page == "index.html" || page == "register.html" || page == "login.html" ) {
			window.location = "wire2.html";
		}
		else if( page == "register.html") {
			// tell user to log out before registering a new account
		}
		else if( page == "login.html") {
			// tell user to log out before logging in
		}
	} else {
		// if user is not logged in and not on index, register, or login page, redirect to index page
		if( page != "index.html" && page != "register.html" && page != "login.html" ) {
			window.location = "index.html";
		}
	}
});



function createUser() {
        
    var inputemail = document.getElementById("regemail").value;
    var inputpassword = document.getElementById("regpassword").value;
    
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





function saveToStack() {
    var authData = ref.getAuth();

    if (authData) {
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
            ref.child("users").child(authData.uid).push({
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
                total: "1199.10"
            });  
        
            window.location = "wire3.html";
        }
    }            
}



window.onload = function() {

var path = window.location.pathname;
var page = path.split("/").pop();


if(page == "wire4.html") {
	var itemkey = window.location.hash.substr(1);
    
    var authData = ref.getAuth();
    qref = ref.child("users");
    qref.child(authData.uid).child(itemkey).once("value", function(snapshot) {
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
else if(page == "wire2.html" || page == "wire3.html") {


	var authData = ref.getAuth();
    qref = ref.child("users");

    qref.child(authData.uid).once("value", function(snapshot) {

        var totalvalue = 0.0;
        
        snapshot.forEach(function(childSnapshot) {
          //  console.log("TEST" + childSnapshot.val().metal);
          
            var entry = childSnapshot.val()
            
            if(page == "wire3.html" && entry.metal == "gold") {
                var tableRef = document.getElementById('gold_table').getElementsByTagName('tbody')[0];

                var row = tableRef.insertRow(-1);
                row.setAttribute('id', childSnapshot.key());
                var image = row.insertCell(-1);
                image.setAttribute('class', "stack_img_col");
                var item = row.insertCell(-1);
                var qty = row.insertCell(-1);
                var weight = row.insertCell(-1);
                var percent = row.insertCell(-1);
                var value = row.insertCell(-1);

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

