var Analytics = require('analytics.js').constructor;
var integration = require('analytics.js-integration');
var sandbox = require('clear-env');
var tester = require('analytics.js-integration-tester');
var ScratchIt = require('./');

describe('ScratchIt', function() {
  var analytics;
  var scratchIt;
  var options = {
    trkId: 'foo'
  };

  beforeEach(function() {
    analytics = new Analytics();
    scratchIt = new ScratchIt(options);
    analytics.use(ScratchIt);
    analytics.use(tester);
    analytics.add(scratchIt);
  });

  afterEach(function() {
    analytics.restore();
    analytics.reset();
    scratchIt.reset();
    sandbox();
  });

  it('should have the right settings', function() {
    analytics.compare(ScratchIt, integration('Scratch-it Analytics')
        .global('_ScratchIt')
        .global('ScratchItAnalytics')
        .option('trkId', ''));
  });

  describe('before loading', function() {
    beforeEach(function() {
      analytics.stub(scratchIt, 'load');
    });

    describe('#initialize', function() {
      it('should call #load', function() {
        analytics.initialize();
        analytics.called(scratchIt.load);
      });
    });
  });

  describe('loading', function() {
    it('should load', function(done) {
      analytics.stub(window, 'Cookies');
      analytics.stub(window.Cookies, 'get');
      analytics.stub(window.Cookies, 'set');
      analytics.stub(window, 'uuid');
      analytics.stub(window.uuid, 'v4');
      analytics.stub(window, 'reqwest');
      analytics.load(scratchIt, done);
    });
  });

  describe('after loading', function() {
    beforeEach(function(done) {
      analytics.stub(window, 'Cookies');
      analytics.stub(window.Cookies, 'get');
      analytics.stub(window.Cookies, 'set');
      analytics.stub(window, 'uuid');
      analytics.stub(window.uuid, 'v4');
      analytics.stub(window, 'reqwest');
      analytics.once('ready', done);
      analytics.initialize();
    });

    describe('#track', function() {
      beforeEach(function() {
        analytics.stub(window._ScratchIt, 'track');
      });

      it('should send an event with default type', function() {
        analytics.track('Goal Reached');
        analytics.called(window._ScratchIt.track, 'track', 'Goal Reached', {});
      });

      it('should send an event', function() {
        analytics.track('Started Scratching', { event_type: 'scratching_page' });
        analytics.called(window._ScratchIt.track, 'scratching_page', 'Started Scratching', {});
      });

      it('should send an event with properties', function() {
        analytics.track('Started Scratching', { event_type: 'scratching_page', foo: 'bar' });
        analytics.called(window._ScratchIt.track, 'scratching_page', 'Started Scratching', { foo: 'bar' });
      });
    });

    describe('#page', function() {
      beforeEach(function() {
        analytics.stub(window._ScratchIt, 'track');
      });

      it('should send a page tracking event', function() {
        analytics.page();
        analytics.called(window._ScratchIt.track, 'track', 'page_visit');
      });
    });
  });
});
