
var dash_button = require('node-dash-button');
var DASH_ADDRESS = '00:26:bb:71:ac:0c';
var dash = dash_button(DASH_ADDRESS);

dash.on('detected', function () {
  console.log('detected');
});

// Don't quit this process
process.stdin.resume();
