var timer = document.getElementById("timer");
var toggleBtn = document.getElementById("toggle");
var checkbtn = document.getElementById("check");

var session = new session();

// user variables
var sessionOn;
var userId;

//tempdata represents current user state
var tempData = {};

// initializing functions
// check for current user and current session state
// if the state is true then btn should be 'stop'
checkCurrentUser();

// if a session is in progress, change the btn to red

toggleBtn.addEventListener("click", function() {
  var timer = document.getElementById("timer");

  checkCurrentUser();
  sessionOn = tempData.sessionOn;
  startactivity(sessionOn);
});

function startactivity(sessionOn) {
  // if sessionOn is not true, start session
  if (!sessionOn) {
    // initialize starting variables
    sessionType = getSessionType();
    startTime = session.start();
    date = session.date();

    //updating UI on page
    timer.textContent = "Session In Progress...";
    toggleBtn.textContent = "Stop";

    // getting the current session ID
    sessionId = tempData.sessionId;
    sessionOn = tempData.sessionOn;
    userId = tempData.userId;

    // make ajax call to start session
    startSession(startTime, sessionType, sessionId, date, userId);
  } else {
    // getting the final time and updating ui
    endTime = session.stop();
    // duration = session.calculateDuration();

    // make ajax call to end session
    endSession(endTime);
  }
}

function getSessionType() {
  return $("#sessionDropdown option:selected").val();
}

function checkCurrentUser() {
  $.ajax({
    url: "checkCurrentUser",
    type: "GET",
    dataType: "json",
    success: function(data) {
      if (data.userEmail != null) {
        //update UI
        $("#currentUser").text("The current user is " + data.userEmail);
        $("#no-auth").css({ display: "none" });
        $("#btnSignIn").css({ display: "none" });

        //update temp variables
        handleData(data);
      } else {
        $("#btnSignOut").css({ display: "none" });
        $("#btnSignIn").css({ display: "block" });
        $(".main-container").css({ display: "none" });
      }
    }
  });
}

function handleData(data) {
  tempData = {
    sessionOn: data.sessionOn,
    sessionId: data.sessionId,
    userId: data.userId
  };
  if (tempData.sessionOn == true) {
    toggleBtn.textContent = "Stop";
    $("#timer").text("There is an ongoing session");
    $("#toggle").addClass("btn-danger");
  }
}

// sign out
$("#btnSignOut").click(function() {
  $.ajax({
    url: "signout",
    type: "POST",
    success: () => {
      checkCurrentUser();
    }
  });
});

// start session gets called when button is clicked
function startSession(startTime, sessionType, sessionId, date, userId) {
  $.ajax({
    url: "startSession",
    type: "POST",
    data: {
      startTime: startTime,
      sessionType: sessionType,
      date: date,
      sessionId: sessionId,
      userId: userId
    },
    dataType: "json",
    success: function(data) {}
  });
}

// end a current session
function endSession(endTime) {
  $.ajax({
    url: "endSession",
    type: "POST",
    data: {
      endTime: endTime
    },
    dataType: "json",
    success: function(data) {
      timer.textContent = "The session time was +" + data.duration;
      toggleBtn.textContent = "Start";
      $("#toggle").removeClass("btn-danger");
    }
  });
}

// Retrieve sessions from a given date

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
    var my_obj_str = data;
    var arr = my_obj_str[0];

    // mapping props to table --> probably could have used .map() function
    for (var i = 0; i < arr.length; i++) {
      props = arr[i];
      var id = props.sessionId;
      var duration = props.duration;
      var date = props.date;
      var start = props.trackstart;
      var end = props.trackend;
      var type = props.sessionType;
      markup =
        "<tr><td>" +
        id +
        "</td><td>" +
        date +
        "</td><td>" +
        start +
        "</td><td>" +
        end +
        "</td><td>" +
        duration +
        "</td><td>" +
        type;
      ("</td></tr>");
      $("table tbody").append(markup);
    }
  }
}

checkbtn.addEventListener("click", function() {
  $("table tbody").html("");
  getSessions();
});

// $("#reset").on("click", () => {
//   $("table tbody").html("");
// });
