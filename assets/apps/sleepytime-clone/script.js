// Update the time readouts for the user, based on current time and time inputs
function updateOutputs() {
  // Get input form element
  var form = document.getElementById("timeForm");

  // Get output elements
  var wakeUpAtOut = form.elements["wakeupat_out"];
  var passOutAtOut = form.elements["passoutat_out"];
  var sleepNowOut = form.elements["sleepnow_out"];

  // Get hour and minute values from input fields
  var hours = parseInt(form.elements["hour"].value);
  var minutes = parseInt(form.elements["minute"].value);

  // Get current hour and minute values from machine
  var d = new Date();
  var currHours = d.getHours();
  var currMinutes = d.getMinutes();

  // Calculate times for waking up at xx:xx, passing out at xx:xx, and going to sleep at current time
  var wakeUpTimes = calculateTimes(hours, minutes, "wakeUp");
  var passOutTimes = calculateTimes(hours, minutes, "passOut");
  var sleepNowTimes = calculateTimes(currHours, currMinutes, "sleepNow");

  // Set outputs accordingly
  wakeUpAtOut.value = wakeUpTimes.join(" or ");
  passOutAtOut.value = passOutTimes.join(" or ");
  sleepNowOut.value = sleepNowTimes.join(" or ");
}

// Function to calculate an array of time values for 1 of 3 contexts
function calculateTimes(hours, minutes, timeType) {
  const decTime = hours + minutes * (1 / 60); // Input time as a decimal value (for calculations)
  var timeArr = []; // Array of times to be displayed to user

  // Use avg REM cycle interval (1.5hrs) to inform user of 6 good times to go to sleep or wake up
  for (const x of [1.5, 3, 4.5, 6, 7.5, 9]) {
    // Step-wise conversion, storing each step in a variable for ease of use and clarity
    const rawTime = timeType === "wakeUp" ? decTime - x : decTime + x;
    const boundedHours = rawTime >= 24 ? rawTime - 24 :
    rawTime < 0 ? rawTime + 24 :
    rawTime;
    const convertedHours = Math.floor(boundedHours);
    const convertedMinutes = Math.round((boundedHours - convertedHours) * 60);
    const formattedMinutes = (convertedMinutes < 10 ? "0" : "") + convertedMinutes;
    const formattedHours = (convertedHours < 10 ? "0" : "") + convertedHours;
    const convertedTime = formattedHours + ":" + formattedMinutes;

    timeArr.push(convertedTime); // Add calculated time to the array of times
  }
  return timeType === "wakeUp" ? timeArr.reverse() : timeArr; // Return populated array of times
}