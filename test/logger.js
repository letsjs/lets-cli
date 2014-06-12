'use strict';

/*global it:true, describe:true, before:true, after:true, expect:true*/
/*jshint unused:false*/

var
    events = require('events'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    logger = require('../cli/logger');


/* Tests
============================================================================= */

describe('Logger in normal mode', function () {
  var normalMockLogger = new events.EventEmitter();

  before(setup.bind(null, normalMockLogger, {}));
  after(teardown);

  it('should log once for "info" and not for "debug"', function () {
    logger.log.callCount.should.equal(1);
    logger.log.firstCall.should.have.been.calledWithExactly('info', 'info1');
  });

  it('should error once for "warn" and once for "error"', function () {
    logger.error.callCount.should.equal(2);
    logger.error.firstCall.should.have.been.calledWithExactly('warn', 'warn1');
    logger.error.secondCall.should.have.been.calledWithExactly('err', 'error1');
  });
});

describe('Logger in --verbose mode', function () {
  var verboseMockLogger = new events.EventEmitter();

  before(setup.bind(null, verboseMockLogger, {
    verbose: true
  }));

  after(teardown);

  it('should log once for "info" and once for "debug"', function () {
    logger.log.callCount.should.equal(2);
    logger.log.firstCall.should.have.been.calledWithExactly('debug', 'debug1');
    logger.log.secondCall.should.have.been.calledWithExactly('info', 'info1');
  });

  it('should error once for "warn" and once for "error"', function () {
    logger.error.callCount.should.equal(2);
    logger.error.firstCall.should.have.been.calledWithExactly('warn', 'warn1');
    logger.error.secondCall.should.have.been.calledWithExactly('err', 'error1');
  });
});

describe('Logger in --quiet mode', function () {
  var quietMockLogger = new events.EventEmitter();

  before(setup.bind(null, quietMockLogger, {
    quiet: true
  }));

  after(teardown);

  it('should not log for "info" or "debug"', function () {
    logger.log.callCount.should.equal(0);
  });

  it('should error once for "warn" and once for "error"', function () {
    logger.error.callCount.should.equal(2);
    logger.error.firstCall.should.have.been.calledWithExactly('warn', 'warn1');
    logger.error.secondCall.should.have.been.calledWithExactly('err', 'error1');
  });
});


/* Helpers
============================================================================= */

function setup (mockLogger, options) {
  logger.isCaptured = false;

  logger.log = sinon.spy();
  logger.error = sinon.spy();

  logger.capture({
    logger: mockLogger
  }, options);

  mockLogger.emit('debug', 'debug1');
  mockLogger.emit('info', 'info1');
  mockLogger.emit('warn', 'warn1');
  mockLogger.emit('err', 'error1');
}

function teardown () {
  // Don't screw with any succeeding tests using the local lets logger
  logger.isCaptured = true;
}
