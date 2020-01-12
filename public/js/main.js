var timer = document.getElementById("timer");
var toggleBtn = document.getElementById("toggle");
var checkbtn = document.getElementById("check");

var session = new session();

var sessionOn = false;

var tracker = [];

// initializing functions
// check for current user and current session state
// if the state is true then btn should be 'stop'
checkCurrentUser();

toggleBtn.addEventListener("click", function() {
  var timer = document.getElementById("timer");
  this.classList.toggle("btn-danger");

  if (!sessionOn) {
    // initialize starting variables
    sessionType = getSessionType();
    startTime = session.start();
    date = session.date();
    sessionOn = true;

    //updating UI on page
    timer.textContent = "Session In Progress...";
    toggleBtn.textContent = "Stop";
    $("#sessionType").toggle();

    // make ajax call to start session
    startSession(sessionOn, startTime, sessionType, date);
  } else {
    // getting the final time and updating ui
    endTime = session.stop();
    duration = session.calculateDuration();

    //updating UI on screen
    timer.textContent = "The session time was +" + duration;
    $("#sessionType").toggle();

    // make ajax call to end session
    endSession(endTime, duration);

    toggleBtn.textContent = "Start";

    // resetting the variables
    sessionOn = false;
  }
});

function getSessionType() {
  return $("#sessionDropdown option:selected").val();
}

// smooth scrolling effect
$("#startBtn").click(function() {
  document.getElementById("main").scrollIntoView();
});

$("#reset").click(function() {
  console.log("reset button clicked");
  $("ol")
    .children()
    .remove();
});

function checkCurrentUser() {
  $.ajax({
    url: "checkCurrentUser",
    type: "GET",
    dataType: "json",
    success: function(data) {
      if (data.userEmail != null) {
        $("#currentUser").text("The current user is " + data.userEmail);
        console.log("the current user is " + data.userEmail);
      } else {
        $("#currentUser").text("");
      }
    }
  });
}

$("#btnSignOut").click(function() {
  console.log("sign out clicked");
  $.ajax({
    url: "signout",
    type: "POST",
    success: () => {
      checkCurrentUser();
    }
  });
});

function handleData(data) {
  console.log(data);
}

function startSession(sessionOn, startTime, sessionType, date) {
  $.ajax({
    url: "startSession",
    type: "POST",
    data: {
      sessionOn: sessionOn,
      startTime: startTime,
      sessionType: sessionType,
      date: date
    },
    dataType: "json",
    success: function(data) {
      console.log("the current sesssion is " + data);
      handleData(data);
    }
  });
}

function endSession(endTime, duration) {
  $.ajax({
    url: "endSession",
    type: "POST",
    data: {
      endTime: endTime,
      duration: duration
    },
    dataType: "json",
    success: function(data) {
      console.log("the current sesssion is " + data);
      handleData(data);
    }
  });
}

// Retrieve sessions from a given date
checkbtn.addEventListener("click", function() {
  function getSessions() {
    // ajax call to get data from firebase
    $.ajax({
      url: "getSession",
      type: "GET",
      dataType: "json",
      success: function(data) {
        updateSessionText(data);
      }
    });

    function updateSessionText(data) {
      var my_obj_str = JSON.stringify(data);
      var parsed_data = my_obj_str[0];

      for (var key in parsed_data) {
        if (parsed_data.hasOwnProperty(key)) {
          firstProp = parsed_data[key];
          console.log(firstProp.trackstart);
          break;
        }
      }
      console.log(my_obj_str);
      $("p").text(my_obj_str);
      // for (var i = 0; i < data.length; i++) {
      //   var sessionType = e[i].sessionType;
      //   var duration = e[i].duration;

      //   text =
      //   "Session Type: " +
      //   firstProp.sessionType +
      //   " | Duration: " +
      //   firstProp.duration;

      // // create a new li and add to list
      // $("ol").append("<li>" + text + "</li>");
      // }
      // return sessionText;
    }
  }

  getSessions();
});
