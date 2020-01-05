var timer = document.getElementById("timer");
var toggleBtn = document.getElementById("toggle");
var checkbtn = document.getElementById("check");

var session = new session();

var sessionOn = false;

var tracker = [];

toggleBtn.addEventListener("click", function() {
  var timer = document.getElementById("timer");

  function trackObject() {
    this.props = {
      trackstart: "",
      trackend: "",
      duration: "",
      sessionType: ""
    };
  }

  if (!sessionOn) {
    var trackObject = new trackObject();

    // get the val of the session type
    trackObject["sessionType"] = getSessionType();
    startTime = session.start();
    timer.textContent = "Session In Progress...";
    toggleBtn.textContent = "Stop";
    sessionOn = true;
  } else {
    // getting the final time and updating ui
    endTime = session.stop();
    duration = session.calculateDuration();

    //updating text on screen
    timer.textContent = "The session time was +" + duration;

    // storing session details in an object
    trackObject["sessionType"] = getSessionType();
    trackObject["trackstart"] = startTime;
    trackObject["trackend"] = endTime;
    trackObject["duration"] = duration;
    console.log(trackObject);

    // storing the session details in an array (for now)
    // TODO: store the details into a local textfile
    tracker.push(trackObject);
    console.log(tracker);
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
