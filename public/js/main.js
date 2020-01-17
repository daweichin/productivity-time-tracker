var timer = document.getElementById("timer");
var toggleBtn = document.getElementById("toggle");
var checkbtn = document.getElementById("check");

var session = new session();

// user variables
var sessionOn;
var userId;
var tempData = {};

// initializing functions
// check for current user and current session state
// if the state is true then btn should be 'stop'
checkCurrentUser();

console.log(tempData);
// if a session is in progress, change the btn to red

toggleBtn.addEventListener("click", function() {
  var timer = document.getElementById("timer");
  this.classList.toggle("btn-danger");

  checkCurrentUser();
  sessionOn = tempData.sessionOn;

  if (!sessionOn) {
    // initialize starting variables
    sessionType = getSessionType();
    startTime = session.start();
    date = session.date();

    //updating UI on page
    timer.textContent = "Session In Progress...";
    toggleBtn.textContent = "Stop";
    $("#sessionType").toggle();

    // getting the current session ID
    sessionId = tempData.sessionId;
    sessionOn = tempData.sessionOn;
    userId = tempData.userId;

    // make ajax call to start session
    startSession(startTime, sessionType, sessionId, date, userId);
  } else {
    // getting the final time and updating ui
    endTime = session.stop();
    duration = session.calculateDuration();

    //updating UI on screen
    timer.textContent = "The session time was +" + duration;
    $("#sessionType").toggle();

    // make ajax call to end session
    // once session is ended: increment sessionId by 1
    endSession(endTime, duration);

    toggleBtn.textContent = "Start";

    // resetting the variables
    sessionOn = false;
  }
});

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
        //update temp variables
        handleData(data);
      } else {
        $("#currentUser").text("Please log in to store sessions");
      }
    }
  });
}

function handleData(data) {
  console.log("checking current user");
  tempData = {
    sessionOn: data.sessionOn,
    sessionId: data.sessionId,
    userId: data.userId
  };
  console.log(tempData);
  if (tempData.sessionOn == true) {
    toggleBtn.classList.add("btn-danger");
    toggleBtn.textContent = "Stop";
  }
}

//what is this?
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
    success: function(data) {
      console.log("the current sesssion is " + data);
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
      var my_obj_str = data;
      var arr = my_obj_str[0];

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

      console.log(my_obj_str);
    }
  }

  getSessions();
});

$("#reset").on("click", () => {
  $("table tbody").html("");
});
