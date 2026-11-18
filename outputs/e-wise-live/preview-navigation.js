(function() {
  'use strict';
  const pageNames = ['home', 'evaluate', 'verdict', 'routing', 'transact', 'marketplace'];
  const embedded = window.parent !== window;

  function selection(value) {
    if (!value || !['resell', 'repair', 'salvage', 'dispose'].includes(value.route)) return null;
    return {route: value.route, method: value.method === 'bidding' ? 'bidding' : 'fixed'};
  }

  function browse(value) {
    if (!value || (value.category === undefined && value.query === undefined && value.q === undefined)) return null;
    const category = ['smartphones', 'laptops', 'tablets', 'audio', 'gaming'].includes(value.category) ? value.category : '';
    const query = typeof value.q === 'string' ? value.q : typeof value.query === 'string' ? value.query : '';
    return {category: category, q: query.trim().slice(0, 100)};
  }

  function requestPage(page, anchor, chosen) {
    if (!pageNames.includes(page)) return;
    window.parent.postMessage({type: 'ewise:navigate', page: page, anchor: anchor || '', selection: selection(chosen), browse: browse(chosen)}, '*');
  }

  document.addEventListener('click', function(event) {
    const link = event.target.closest('a[data-page]');
    if (!embedded || !link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (!pageNames.includes(link.dataset.page)) return;
    event.preventDefault();
    requestPage(link.dataset.page, link.dataset.anchor, link.dataset);
  });

  const evaluator = document.querySelector('.hero-evaluator');
  if (evaluator && embedded) {
    evaluator.addEventListener('submit', function(event) {
      event.preventDefault();
      requestPage('evaluate');
    });
  }

  window.addEventListener('message', function(event) {
    const message = event.data;
    if (!message || typeof message !== 'object') return;
    const frames = Array.from(document.querySelectorAll('.board iframe[data-page]'));
    const sender = frames.find(function(frame) { return frame.contentWindow === event.source; });
    if (sender && message.type === 'ewise:resize') {
      if (Number.isFinite(message.height) && message.height >= 100 && message.height <= 20000) {
        sender.height = Math.ceil(message.height);
        sender.style.height = Math.ceil(message.height) + 'px';
      }
    }
    if (sender && message.type === 'ewise:navigate' && pageNames.includes(message.page)) {
      const target = frames.find(function(frame) { return frame.dataset.page === message.page; });
      if (!target) return;
      const chosen = selection(message.selection);
      if (chosen && ['routing', 'transact'].includes(message.page)) {
        target.contentWindow.postMessage({type: 'ewise:selection', selection: chosen}, '*');
      }
      const filters = browse(message.browse);
      if (filters && message.page === 'marketplace') {
        target.contentWindow.postMessage({type: 'ewise:browse', browse: filters}, '*');
      }
      target.closest('.board').scrollIntoView({behavior: 'auto', block: 'start'});
      if (message.anchor === 'marketplace' && message.page === 'home') {
        target.contentWindow.postMessage({type: 'ewise:scroll-anchor', anchor: 'marketplace'}, '*');
      }
    }
    if (embedded && event.source === window.parent && message.type === 'ewise:scroll-anchor' && message.anchor === 'marketplace') {
      const section = document.getElementById('marketplace');
      if (section) section.scrollIntoView({behavior: 'auto', block: 'start'});
    }
    if (embedded && event.source === window.parent && message.type === 'ewise:selection') {
      const chosen = selection(message.selection);
      if (chosen) document.dispatchEvent(new CustomEvent('ewise:selection', {detail: chosen}));
    }
    if (embedded && event.source === window.parent && message.type === 'ewise:browse') {
      const filters = browse(message.browse);
      if (filters) document.dispatchEvent(new CustomEvent('ewise:browse', {detail: filters}));
    }
  });

  if (embedded && typeof ResizeObserver !== 'undefined') {
    function reportHeight() {
      window.parent.postMessage({type: 'ewise:resize', height: Math.ceil(document.body.getBoundingClientRect().height)}, '*');
    }
    new ResizeObserver(reportHeight).observe(document.body);
    if (document.fonts) document.fonts.ready.then(reportHeight);
    reportHeight();
  }
})();
