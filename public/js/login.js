$("#btnSignUp").click(function() {
  console.log("signing user up");

  var email = $("#txtEmail").val();
  var password = $("#txtPassword").val();

  var data = { userEmail: email, userPassword: password };

  $.ajax({
    url: "createUser",
    type: "POST",
    data: data,
    dataType: "json",
    success: data => {
      console.log("create success");
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
      console.log(data.success);
      if (data.success) {
        console.log(data.email + " is logged in");
        window.location.replace("/landing.html");
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
