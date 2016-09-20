
var dash_button = require('node-dash-button');
var DASH_ADDRESS = '00:26:bb:71:ac:0c';
var dash = dash_button(DASH_ADDRESS);

var throttle = false, throttle_timeout;

dash.on('detected', function () {
  if (!throttle) {
    console.log('detected');
    throttle = true;

    // We only want to send signals once every 10s, max
    clearTimeout(throttle_timeout);
    throttle_timeout = setTimeout(function () {
      throttle = false;
    }, 10000);
  }
});

// Don't quit this process
process.stdin.resume();

// Quit process once we receive input
process.stdin.on('data', function () {
  process.exit();
});
