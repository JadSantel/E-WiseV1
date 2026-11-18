const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const code = fs.readFileSync('outputs/e-wise-live/preview-navigation.js', 'utf8');

function harness(embedded) {
  const windowEvents = {}, documentEvents = {}, formEvents = {}, messages = [], scrolled = [];
  const parent = {postMessage: message => messages.push(message)};
  const window = {addEventListener: (name, callback) => windowEvents[name] = callback};
  window.parent = embedded ? parent : window;
  const frames = ['home', 'evaluate', 'verdict'].map(page => ({
    dataset: {page}, style: {}, contentWindow: {postMessage: message => messages.push(message)},
    closest: () => ({scrollIntoView: () => scrolled.push(page)}),
  }));
  const document = {
    addEventListener: (name, callback) => documentEvents[name] = callback,
    querySelector: () => ({addEventListener: (name, callback) => formEvents[name] = callback}),
    querySelectorAll: () => frames,
    getElementById: id => id === 'marketplace' ? {scrollIntoView: () => scrolled.push('anchor')} : null,
    body: {getBoundingClientRect: () => ({height: 1234.2})},
  };
  class ResizeObserver { constructor(callback) { this.callback = callback; } observe() { this.callback(); } }
  vm.runInNewContext(code, {window, document, ResizeObserver});
  return {windowEvents, documentEvents, formEvents, frames, parent, messages, scrolled};
}

const board = harness(false);
board.windowEvents.message({source: {}, data: {type: 'ewise:navigate', page: 'verdict'}});
assert.equal(board.scrolled.length, 0, 'Ignore navigation from an unrelated window');
board.windowEvents.message({source: board.frames[1].contentWindow, data: {type: 'ewise:navigate', page: 'verdict'}});
assert.equal(board.scrolled.at(-1), 'verdict');
board.windowEvents.message({source: board.frames[2].contentWindow, data: {type: 'ewise:navigate', page: 'evaluate'}});
assert.equal(board.scrolled.at(-1), 'evaluate');
board.windowEvents.message({source: board.frames[2].contentWindow, data: {type: 'ewise:navigate', page: 'home', anchor: 'marketplace'}});
assert.equal(board.scrolled.at(-1), 'home');
assert.equal(board.messages.at(-1).type, 'ewise:scroll-anchor');
for (const height of ['900', NaN, Infinity, -1, 20001]) {
  board.windowEvents.message({source: board.frames[0].contentWindow, data: {type: 'ewise:resize', height}});
  assert.equal(board.frames[0].style.height, undefined);
}
board.windowEvents.message({source: board.frames[0].contentWindow, data: {type: 'ewise:resize', height: 1400.5}});
assert.equal(board.frames[0].style.height, '1401px');
const child = harness(true);
assert.ok(child.messages.some(message => message.type === 'ewise:resize' && message.height === 1235));
let prevented = false;
const click = {target: {closest: () => ({dataset: {page: 'verdict'}})}, button: 0, preventDefault: () => prevented = true};
child.documentEvents.click(click);
assert.equal(prevented, true);
assert.equal(child.messages.at(-1).page, 'verdict');
prevented = false;
board.documentEvents.click(click);
assert.equal(prevented, false, 'Standalone links retain native navigation');
child.formEvents.submit({preventDefault() {}});
assert.equal(child.messages.at(-1).page, 'evaluate');
child.windowEvents.message({source: child.parent, data: {type: 'ewise:scroll-anchor', anchor: 'marketplace'}});
assert.equal(child.scrolled.at(-1), 'anchor');

const verdict = fs.readFileSync('outputs/e-wise-live/verdict.html', 'utf8');
const sellingScript = [...verdict.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
const inputs = ['fixed', 'bidding'].map(value => ({value, addEventListener(name, callback) { this.change = callback; }}));
const explanation = {textContent: ''};
vm.runInNewContext(sellingScript, {document: {querySelectorAll: () => inputs, getElementById: () => explanation}});
inputs[1].change();
assert.match(explanation.textContent, /place bids/);
inputs[0].change();
assert.match(explanation.textContent, /asking price/);
console.log('Passed: board navigation, edit/back links, sender validation, frame resizing, standalone links, and selling-option state.');
