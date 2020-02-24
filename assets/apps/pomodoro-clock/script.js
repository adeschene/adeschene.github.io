// Everything is contained within this single component
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: 25, // Indicates the length of a pomodoro
      breakLength: 5, // Indicates the length of a break
      timer: null, // Holds the interval timer
      timeLeft: '25:00', // Holds the time remaining in a countdown
      timerPaused: true, // Indicates timer state
      timerFor: 'Pomodoro' // Indicates which phase we're currently in
    };
    // Function bindings
    this.handleIncrement = this.handleIncrement.bind(this);
    this.handleDecrement = this.handleDecrement.bind(this);
    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }
  // Increment break or session length, update timer readout if session length changed
  handleIncrement(e) {
    switch (e.currentTarget["id"]) {
      case "break-increment":
        if (this.state.breakLength < 60) {// Don't go above sixty minutes
          this.setState(oldState => ({
            breakLength: oldState.breakLength + 1 }));

        }
        break;
      case "session-increment":
        if (this.state.sessionLength < 60) {// Don't go above sixty minutes
          this.setState(oldState => ({
            sessionLength: oldState.sessionLength + 1,
            timeLeft: oldState.sessionLength < 9 ?
            '0' + (oldState.sessionLength + 1) + ':00' :
            oldState.sessionLength + 1 + ':00' }));

        }
        break;
      default:
        console.log("increment error");}

  }
  /* Decrement break or session length without going below a value of 0,
       update timer readout if session length changed */
  handleDecrement(e) {
    switch (e.currentTarget["id"]) {
      case "break-decrement":
        if (this.state.breakLength > 1) {// Don't go to or below zero minutes
          this.setState(oldState => ({
            breakLength: oldState.breakLength - 1 }));

        }
        break;
      case "session-decrement":
        if (this.state.sessionLength > 1) {// Don't go to or below zero minutes
          this.setState(oldState => ({
            sessionLength: oldState.sessionLength - 1,
            timeLeft: oldState.sessionLength <= 10 ?
            '0' + (oldState.sessionLength - 1) + ':00' :
            oldState.sessionLength - 1 + ':00' }));

        }
        break;
      default:
        console.log("decrement error");}

  }
  handlePlayPause() {
    /* Controls the countdown, changes from one phase to the next,
                        plays audio at switch, updates/formats time left display, etc. */
    const countdown = () => {
      // Determine whether the timer is up or not, switch to new timer, etc.
      if (this.state.timeLeft === '00:00') {
        document.getElementById("beep").play(); // Play beep audio
        // Just finished a pomodoro, start the next break
        if (this.state.timerFor === 'Pomodoro') {
          this.setState(oldState => ({
            timerFor: 'Rest',
            timeLeft: oldState.breakLength < 10 ?
            '0' + oldState.breakLength + ':00' :
            oldState.breakLength + ':00',
            sessionsLeft: oldState.sessionsLeft - 1 }));

          return {};
        } else {// Just finished a break, start the next pomodoro
          this.setState(oldState => ({
            timerFor: 'Pomodoro',
            timeLeft: oldState.sessionLength < 10 ?
            '0' + oldState.sessionLength + ':00' :
            oldState.sessionLength + ':00' }));

          return {};
        }
      }
      // Get current timer value, split it into mins and secs as ints
      let currTime = this.state.timeLeft.split(':');
      let minsLeft = parseInt(currTime[0]);
      let secsLeft = parseInt(currTime[1]);
      // Determine timer value minus 1 second and output in correct format
      if (minsLeft < 10) {
        minsLeft = '0' + (minsLeft > 0 && secsLeft === 0 ? minsLeft - 1 : minsLeft);
      } else if (minsLeft === 10) {
        minsLeft = secsLeft === 0 ? '09' : '10';
      } else {
        minsLeft = secsLeft === 0 ? minsLeft - 1 : minsLeft;
      }
      secsLeft = secsLeft === 0 ? '59' :
      secsLeft <= 10 ? '0' + (secsLeft - 1) :
      secsLeft - 1;
      // Set the new timer value (e.g. to old timer value minus 1 second)
      this.setState({
        timeLeft: minsLeft + ':' + secsLeft });

    };
    // If the timer is paused, start it, otherwise, pause it
    if (this.state.timerPaused) {
      this.setState({
        timerPaused: false,
        timer: setInterval(countdown, 1000) });

    } else {
      clearInterval(this.state.timer);
      this.setState({
        timerPaused: true });

    }
  }
  // Set all values back to default, stop timer
  handleReset() {
    clearInterval(this.state.timer); // Stop countdown
    // Get audio element, pause it, and reset it to the beginning
    let beep = document.getElementById("beep");
    beep.pause();
    beep.currentTime = 0;
    // Set state values to defaults
    this.setState({
      sessionLength: 25,
      sessionsLeft: 4,
      breakLength: 5,
      timer: null,
      timeLeft: '25:00',
      timerPaused: true,
      timerFor: 'Pomodoro' });

  }
  render() {
    return (
      React.createElement("div", { id: "wrapper" },
      React.createElement("div", { id: "left-well" },
      React.createElement("div", { id: "session-area", class: "area-container" },
      React.createElement("h1", { id: "session-label" }, "Pomodoro", React.createElement("br", null), "Length"),
      React.createElement("h2", { id: "session-length", class: "time-readout" }, this.state.sessionLength),
      React.createElement("div", { id: "session-buttons", class: "inc-dec-btns" },
      React.createElement("button", {
        id: "session-increment",
        class: "inc-btn",
        onClick: this.handleIncrement }, React.createElement("i", { class: "fas fa-plus" })),
      React.createElement("button", {
        id: "session-decrement",
        class: "dec-btn",
        onClick: this.handleDecrement }, React.createElement("i", { class: "fas fa-minus" }))))),



      React.createElement("div", { id: "mid-well" },
      React.createElement("div", { id: "timer-area", class: "area-container" },
      React.createElement("div", { id: "timer" },
      React.createElement("h1", { id: "timer-label" }, this.state.timerFor),
      React.createElement("h2", { id: "time-left", class: "time-readout" }, this.state.timeLeft),
      React.createElement("div", { id: "timer-buttons" },
      React.createElement("button", {
        id: "start_stop",
        class: "timer-btns",
        onClick: this.handlePlayPause }, React.createElement("i", { class: "fas fa-play" }), React.createElement("i", { class: "fas fa-pause" })),
      React.createElement("button", {
        id: "reset",
        class: "timer-btns",
        onClick: this.handleReset }, React.createElement("i", { class: "fas fa-stop" })),
      React.createElement("audio", { id: "beep" },
      React.createElement("source", { src: "https://fcc-web-images-bucket.s3-us-west-2.amazonaws.com/audio/civildefensesiren.wav" }), "Your browser does not support the audio tag."))))),






      React.createElement("div", { id: "right-well" },
      React.createElement("div", { id: "break-area", class: "area-container" },
      React.createElement("h1", { id: "break-label" }, "Rest", React.createElement("br", null), "Length"),
      React.createElement("h2", { id: "break-length", class: "time-readout" }, this.state.breakLength),
      React.createElement("div", { id: "break-buttons", class: "inc-dec-btns" },
      React.createElement("button", {
        id: "break-increment",
        class: "inc-btn",
        onClick: this.handleIncrement }, React.createElement("i", { class: "fas fa-plus" })),
      React.createElement("button", {
        id: "break-decrement",
        class: "dec-btn",
        onClick: this.handleDecrement }, React.createElement("i", { class: "fas fa-minus" })))))));





  }}
;

ReactDOM.render(React.createElement(App, null), document.getElementById("app-surrogate"));