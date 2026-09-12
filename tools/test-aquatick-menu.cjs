const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '..', 'site-src/scripts/aquatick/04-nav-menu.js'), 'utf8');

class Node {
  constructor() {
    this.listeners = {};
    this.parentNode = null;
    this.children = [];
  }

  addEventListener(type, listener) {
    (this.listeners[type] ||= []).push(listener);
  }

  appendChild(child) {
    child.parentNode = this;
    this.children.push(child);
    return child;
  }

  contains(node) {
    return node === this || this.children.some((child) => child.contains(node));
  }

  dispatchEvent(event) {
    event.target ||= this;
    event.defaultPrevented ||= false;
    for (let node = this; node; node = node.parentNode) {
      event.currentTarget = node;
      for (const listener of node.listeners[event.type] || []) listener(event);
    }
    return !event.defaultPrevented;
  }
}

class Element extends Node {
  constructor(selector) {
    super();
    this.selector = selector;
    this.open = false;
    this.focusCount = 0;
  }

  querySelector(selector) {
    return this.children.find((child) => child.selector === selector) || null;
  }

  querySelectorAll(selector) {
    return this.children.filter((child) => child.selector === selector);
  }

  focus() {
    this.focusCount += 1;
  }
}

function harness(withMenu = true) {
  const document = new Node();
  let menu = null;
  let summary = null;
  let links = [];
  let inside = new Element('.inside');
  const outside = new Element('.outside');

  if (withMenu) {
    menu = new Element('.nav-menu');
    summary = new Element('summary');
    links = ['#features', '#screens', '#privacy'].map((href) => {
      const link = new Element('a');
      link.href = href;
      return link;
    });
    menu.appendChild(summary);
    links.forEach((link) => menu.appendChild(link));
    menu.appendChild(inside);
    document.appendChild(menu);
  }

  document.appendChild(outside);

  document.querySelector = (selector) => selector === '.nav-menu' ? menu : null;
  vm.runInNewContext(source, { document });

  return { document, menu, summary, links, inside, outside };
}

function click(node) {
  const event = { type: 'click', defaultPrevented: false };
  node.dispatchEvent(event);
  return event;
}

for (let index = 0; index < 3; index += 1) {
  const test = harness();
  test.menu.open = true;
  const event = click(test.links[index]);
  assert.match(test.links[index].href, /^#/);
  assert.equal(test.menu.open, false, 'link selection closes menu');
  assert.equal(event.defaultPrevented, false, 'link selection keeps native navigation');
}

{
  const test = harness();
  test.menu.open = true;
  test.document.dispatchEvent({ type: 'keydown', key: 'Escape' });
  assert.equal(test.menu.open, false, 'Escape closes an open menu');
  assert.equal(test.summary.focusCount, 1, 'Escape returns focus to summary');
}

{
  const test = harness();
  test.document.dispatchEvent({ type: 'keydown', key: 'Escape' });
  assert.equal(test.menu.open, false, 'Escape leaves a closed menu closed');
  assert.equal(test.summary.focusCount, 0, 'closed-menu Escape does not move focus');
}

{
  const test = harness();
  test.menu.open = true;
  click(test.outside);
  assert.equal(test.menu.open, false, 'outside click closes menu');
}

{
  const test = harness();
  test.menu.open = true;
  click(test.inside);
  assert.equal(test.menu.open, true, 'inside click keeps menu open');
}

harness(false);
console.log('[test-aquatick-menu] pass');
