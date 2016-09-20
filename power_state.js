
const applescript = require('applescript');
const spawn       = require('child_process').spawn;

var TEMPLATE =
  'tell application "System Events"\n' +
    'do shell script "caffeinate -u -t 1"\n' +
    'delay 0.1\n' +
    'tell application "System Events" to tell process "loginwindow"\n' +
      'activate\n' +
        'tell window "Login Panel"\n' +
          'keystroke "PASSWORD"\n' +
          'keystroke return\n' +
        'end tell\n' +
    'end tell\n' +
  'end tell';

module.exports = (function () {

  function PowerState (password) {
    this.script = TEMPLATE.replace('PASSWORD', password);
  }

  /**
   * Unlocks the computer.
   */
  PowerState.prototype.unlock = function (cb) {
    applescript.execString(this.script, function (err, rtn) {
      if (err) return console.error('Error running AppleScript:', err);
      if (cb) cb();
    });
  }

  /**
   * Returns the state of the computer.
   * 1 -> asleep
   * 4 -> awake
   */
  PowerState.prototype.state = function (cb) {
    const pstate = spawn('ioreg', ['-n', 'IODisplayWrangler', '|', 'grep', '-i', 'IOPowerManagement']);

    var data_acc = '';
    pstate.stdout.on('data', (data) => {
      data_acc += data;
    });

    pstate.stderr.on('data', (data) => {
      console.error('Error getting power state:', data);
    });

    pstate.on('close', (code) => {
      var idx = data_acc.indexOf('"CurrentPowerState"=');
      cb(data_acc.charAt(idx + 20).trim());
    });
  }

  return PowerState;

})();
