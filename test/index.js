'use strict';

/*global it:true, describe:true, before:true, expect:true*/
/*jshint unused:false*/

var
    path = require('path'),
    chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    cli = require('../.'),
    lets = require('lets'),
    letsfile = require('./Letsfile');

chai.should();
chai.use(sinonChai);


/* Spies
============================================================================= */

sinon.spy(lets, 'load');
sinon.spy(lets, 'runTasks');


/* Tests
============================================================================= */

describe('$ lets deploy testing', function () {
  var testTask = 'deploy',
      testStage = 'testing';

  describe('with correct cwd', function () {
    before(function () {
      cli.logger.log = sinon.spy();
      cli.logger.error = sinon.spy();

      cli.argv({ _: [testTask, testStage] }, __dirname);
    });

    it('should have found the local lets installation', function () {
      cli.argv.lets.should.equal(lets);
    });

    it('should have loaded the local Letsfile', function () {
      cli.argv.letsfile.should.equal(letsfile);
    });

    it('should have called Lets.load', function () {
      lets.load.should.be.calledWithExactly(letsfile);
    });

    it('should have called Lets.runTasks', function () {
      lets.runTasks.should.be.calledWithExactly(
        lets.load.returnValues[0], testTask, testStage, cli.argv.done);
    });

    it('should have exited ok', function () {
      cli.logger.log.should.have.been.calledWithExactly('OK');
    });
  });

  describe('with no Letsfile', function () {
    before(function () {
      cli.argv.letsfile = undefined;
      cli.argv.lets = undefined;
    });

    it('should throw an error', function () {
      expect(cli.argv.bind(
        cli, { _: [testTask, testStage] }, path.join(__dirname, '..')))
        .to.throw(cli.argv.letsfileError);
    });
  });

  describe('with no local lets', function () {
    before(function () {
      cli.argv.letsfile = undefined;
      cli.argv.lets = undefined;
    });

    it('should throw an error', function () {
      expect(cli.argv.bind(
        cli, { _: [testTask, testStage] }, '/lets-complete-and-utter-bogus'))
        .to.throw(cli.argv.letsError);
    });
  });
});


describe('$ lets -v', function () {
  var pkg = require('../package'),
      letsPkg = require('lets/package');

  before(function () {
    cli.argv.letsfile = undefined;
    cli.argv.lets = undefined;

    cli.logger.log = sinon.spy();
    cli.logger.error = sinon.spy();

    cli.argv({ v: true }, __dirname);
  });

  it('should print the versions', function () {
    cli.logger.log.firstCall.should.have.been.calledWithMatch(
      new RegExp(pkg.name + ' v' + pkg.version.replace(/\./g, '\\.')));

    cli.logger.log.secondCall.should.have.been.calledWithMatch(
      new RegExp(letsPkg.name + ' v' + letsPkg.version.replace(/\./g, '\\.')));
  });
});
