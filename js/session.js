function session() {
  var startTime = moment();
  var endTime;

  //TODO: Clear up the function logic

  function updateTime() {
    time = moment().format("HH:mm:ss");
    return time;
  }

  // recording the starting time
  this.start = function() {
    startTime = updateTime();
    return startTime;
  };

  // recording the ending time
  this.stop = function() {
    endTime = moment().format("HH:mm:ss");
    return endTime;
  };

  this.calculateDuration = function() {
    var duration = calculateSessionTime();
    return duration;
  };

  function calculateSessionTime() {
    var duration = moment
      .utc(moment(endTime, "HH:mm:ss").diff(moment(startTime, "HH:mm:ss")))
      .format("HH:mm:ss");

    console.log(startTime, endTime);
    console.log(duration);
    return duration;
  }
}
