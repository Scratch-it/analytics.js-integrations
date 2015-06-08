
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
  .global('_ScratchIt')
  .global('ScratchItAnalytics')
  .option('trkId', '')
  .option('url', 'http://trk.scratch-it.com/trk')
  .tag('<script src="//static.scratch-it.com/public/scratch-it-analytics.min.js">');

/**
 * Initialize.
 */
ScratchIt.prototype.initialize = function() {
  var self = this;

  this.load(function(){
    window._ScratchIt = new window.ScratchItAnalytics(self.options.trkId, { url: self.options.url });
    self.ready();
  });
};

/**
 * Loaded?
 *
 * @return {boolean}
 */
ScratchIt.prototype.loaded = function() {
  return is.object(window._ScratchIt);
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

/**
 * Page.
 *
 * @param {Page} page
 */
ScratchIt.prototype.page = function(page) {
  var customProperties = page.properties();
  del(customProperties, 'event_type');
  window._ScratchIt.track('page_visit', 'page_visit', customProperties);
};
