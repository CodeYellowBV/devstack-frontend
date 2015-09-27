import 'init';
import './spec/index';
import sinon from 'sinon';
import loca from 'loca';

let failedCount = 0;

// Add a reporter that logs everying to the console.
// TODO: When using this, the web reporter is disabled. Multi-reporter support has not landed yet.
mocha.reporter(loca);

mocha.suite.afterAll(function(done) {
    if (_.isFunction(window.onMochaTestFinish)) {
        window.onMochaTestFinish(failedCount);
    }
    done();
});

beforeEach(function() {
    this.sinon = sinon.sandbox.create();
});

afterEach(function() {
    if (this.currentTest.state === 'failed') {
        failedCount++;
    }

    this.sinon.restore();
});
