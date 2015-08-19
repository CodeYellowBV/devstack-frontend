import 'init';
import './spec/index';
import sinon from 'sinon';
// import loca from 'loca';

// Add a reporter that logs everying to the console.
// TODO: When using this, the web reporter is disabled. Multi-reporter support has not landed yet.
// Maybe we should write our own hack for this? We need a hack anyway to forward the correct exit code to run-chromium-headless
// mocha.reporter(loca);

beforeEach(function() {
    this.sinon = sinon.sandbox.create();
});

afterEach(function() {
    this.sinon.restore();
});
