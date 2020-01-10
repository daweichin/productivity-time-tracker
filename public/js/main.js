var timer = document.getElementById("timer");
var toggleBtn = document.getElementById("toggle");
var checkbtn = document.getElementById("check");

var session = new session();

var sessionOn = false;

var tracker = [];

checkCurrentUser();

toggleBtn.addEventListener("click", function() {
  var timer = document.getElementById("timer");

  if (!sessionOn) {
    // initialize starting variables
    sessionType = getSessionType();
    startTime = session.start();
    sessionOn = true;

    //updating UI on page
    timer.textContent = "Session In Progress...";
    toggleBtn.textContent = "Stop";
    $("#sessionType").toggle();

    // make ajax call to start session
    startSession(sessionOn, startTime, sessionType);
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

checkbtn.addEventListener("click", function() {
  updateSessionText(tracker);
});

function getSessionType() {
  return $("#sessionDropdown option:selected").val();
}

$("#startBtn").click(function() {
  document.getElementById("main").scrollIntoView();
});

sessionText = [];
function updateSessionText(e) {
  for (var i = 0; i < e.length; i++) {
    var sessionType = e[i].sessionType;
    var duration = e[i].duration;
    text = "Session Type: " + sessionType + " | Duration: " + duration;

    // create a new li and add to list
    $("ol").append("<li>" + text + "</li>");
  }
  return sessionText;
}

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

function startSession(sessionOn, startTime, sessionType) {
  $.ajax({
    url: "startSession",
    type: "POST",
    data: {
      sessionOn: sessionOn,
      startTime: startTime,
      sessionType: sessionType
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
