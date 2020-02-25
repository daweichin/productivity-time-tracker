var timer = document.getElementById("timer");
var toggleBtn = document.getElementById("toggle");
var checkBtn = document.getElementById("checkBtn");
var dateBtn = document.getElementById("dateBtn");

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
getTimes();

// Event Handlers and Listeners
toggleBtn.addEventListener("click", function() {
  var timer = document.getElementById("timer");

  checkCurrentUser();

  sessionOn = tempData.sessionOn;
  startactivity(sessionOn);
});

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

checkBtn.addEventListener("click", function() {
  $("table tbody").html("");
  getAllSessions();
});

dateBtn.addEventListener("click", function() {
  $("table tbody").html("");
  $.ajax({
    url: "getSession",
    type: "GET",
    success: function(data) {
      // get relevant data from specific date
      dateArray = getSessionsFromDate(data, (temp = []));
      console.log(tempData.dateArray);
      // update the table with new data
      updateSessionText(dateArray);
    },
    error: function(error) {
      console.log(error);
    }
  });
});

// Helper Functions

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
    getTimes();

    // make ajax call to end session
    endSession(endTime);
  }
}

function getSessionType() {
  return $("#sessionDropdown option:selected").val();
}

function getDate() {
  return $("#dateInput").val();
}

function checkCurrentUser() {
  $.ajax({
    url: "checkCurrentUser",
    type: "GET",
    dataType: "json",
    success: function(data) {
      if (data.userEmail != null) {
        //update UI
        $("#currentUser").text("Logged in as " + data.userEmail);
        $("#no-auth").css({ display: "none" });
        $("#btnSignIn").css({ display: "none" });

        //update temp variables
        handleData(data);
      } else {
        $("#btnSignOut").css({ display: "none" });
        $("#btnSignIn").css({ display: "block" });
        $(".main").css({ display: "none" });
      }
    }
  });
}

function handleData(data) {
  tempData = {
    sessionOn: data.sessionOn,
    sessionId: data.sessionId,
    userId: data.userId,
    dateArray: data.dateArray
  };

  if (tempData.sessionOn == true) {
    toggleBtn.textContent = "Stop";
    $("#timer").text("There is an ongoing session");
    $("#toggle").addClass("btn-danger");
  }
}

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
    success: function(data) {
      console.log("working");
    }
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
function getSessionsFromDate(array, temp = []) {
  array = array[0];
  array.forEach(element => {
    selectedDate = getDate();
    date = element.date;
    if (date == selectedDate) {
      element = JSON.stringify(element);
      temp.push(JSON.parse(element));
    }
  });
  return temp;
}

// retrieves all sessions
function getAllSessions() {
  // ajax call to get data from firebase
  $.ajax({
    url: "getSession",
    type: "GET",
    success: function(data) {
      // updates table with data
      temp = [];
      array = data[0];
      array.forEach(element => {
        element = JSON.stringify(element);
        temp.push(JSON.parse(element));
      });

      updateSessionText(temp);
    },
    error: function(error) {
      console.log(error);
    }
  });
}

// expects an array with json strings
function updateSessionText(data) {
  var arr = data;

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

// Sum up duration for each date categorized on type of session for one week

// Chart.js

var ctx = document.getElementById("myChart");

// initialize one weeks worth of dates to pass in as chart labels
tempLabels = ["Active", "Passive", "Chilling", "Other"];
// function lastWeekDates() {
//   for (var i = 7; i > 0; i--) {
//     // get one weeks worth of dates
//     date = moment()
//       .day(-i)
//       .format("DD-MM-YYYY");
//     temp.push(date);
//   }
// }
function getTimes() {
  $.ajax({
    url: "sumDuration",
    type: "GET",
    success: data => {
      console.log(data);
      var temp = [];
      // could map from templabels
      temp[0] = data["Active"];
      temp[1] = data["Passive"];
      temp[2] = data["Chilling"];
      temp[3] = data["Other"];

      console.log(temp);
      createChart(temp);
    },
    error: data => {
      $("#errormsg").text(data.error);
    }
  });
}

function createChart(temp) {
  var myChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: tempLabels,
      datasets: [
        {
          label: "Time Data",
          data: temp,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(255, 206, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(255, 159, 64, 0.2)"
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)"
          ],
          borderWidth: 1
        }
      ]
    },
    options: {
      title: {
        display: true,
        text: "Time spent on each activity"
      },
      scales: {
        yAxes: [
          {
            scaleLabel: {
              display: true,
              labelString: "minutes"
            },
            ticks: {
              beginAtZero: true
            }
          }
        ]
      }
    }
  });
}
