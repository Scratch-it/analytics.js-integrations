
/**
 * Module dependencies.
 */

var integration = require('analytics.js-integration');
var is = require('is');
var del = require('obj-case').del;

/**
 * Expose `ScratchIt` integration.
 */

var ScratchIt = module.exports = integration('Scratch-it Analytics')
  .global('ScratchIt')
  .option('trkId', '')
  .tag('<script src="//static.scratch-it.com/public/scratch-it-analytics.min.js">');

/**
 * Initialize.
 */

ScratchIt.prototype.initialize = function() {
  // Shim out the Scratchit library.
  window._ScratchIt = {
    track: function(event_type, event_name, parameters) {
      // no-op
      console.log(event_type);
      console.log(event_name);
      console.log(parameters);
    }
  }; // TODO: real object
  this.load(this.ready);
};

/**
 * Loaded?
 *
 * @return {boolean}
 */

ScratchIt.prototype.loaded = function() {
  return is.fn(window.ScratchIt);
};

/**
 * Track.
 *
 * @param {Track} track
 */

ScratchIt.prototype.track = function(track) {
  var parameters = track.properties();
  var event_type = parameters.event_type || 'track';
  del(parameters, 'event_type');
  window._ScratchIt.track(event_type, track.event(), parameters);
};
