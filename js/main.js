var timer = document.getElementById("timer");
var toggleBtn = document.getElementById("toggle");
var resetBtn = document.getElementById("reset");

// var watch = new stopWatch(timer);

var session = new session();
var sessionOn = false;

toggleBtn.addEventListener("click", function() {
  if (!sessionOn) {
    startTime = session.start();
    timer.textContent = "Keep Working!";
    toggleBtn.textContent = "Stop";
    sessionOn = true;
  } else {
    final = session.stop();
    timer.textContent = "The session time was +" + final;
    toggleBtn.textContent = "Start";
    sessionOn = false;
  }
});

resetBtn.addEventListener("click", function() {
  watch.reset();
});
