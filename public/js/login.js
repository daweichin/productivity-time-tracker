$("#btnSignUp").click(function() {
  var email = $("#txtEmail").val();
  var password = $("#txtPassword").val();

  var data = { userEmail: email, userPassword: password };

  $.ajax({
    url: "createUser",
    type: "POST",
    data: data,
    dataType: "json",
    success: data => {
      if (data == true) {
        window.location.replace("/landing.html");
      } else {
        $("#errormsg").text(data.error);
      }
    },
    error: data => {
      $("#errormsg").text(data.error);
    }
  });
});

$("#btnLogin").click(function() {
  console.log("logging user in");

  var email = $("#txtEmail").val();
  var password = $("#txtPassword").val();

  var data = { userEmail: email, userPassword: password };

  $.ajax({
    url: "login",
    type: "POST",
    data: data,
    dataType: "json",
    success: function(data) {
      if (data.success) {
        console.log(data.email + " is logged in");
        window.location.replace("/landing.html");
      } else {
        // update a text to say login failed
        $("#loginFailed").text("Login Failed");
        $("#errormsg").text(data.error);
      }
    },
    error: function(errorMessage) {
      console.log("Error: ", errorMessage);
    }
  });
});

$("#btnSignOut").click(function() {
  console.log("sign out clicked");
  $.ajax({
    url: "signout",
    type: "POST",
    success: () => {
      console.log("log out success");
      window.location.replace("/login.html");
    }
  });
});
