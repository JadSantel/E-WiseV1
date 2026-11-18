(function() {
  'use strict';
  const pageNames = ['home', 'evaluate', 'verdict'];
  const embedded = window.parent !== window;

  function requestPage(page, anchor) {
    if (!pageNames.includes(page)) return;
    window.parent.postMessage({type: 'ewise:navigate', page: page, anchor: anchor || ''}, '*');
  }

  document.addEventListener('click', function(event) {
    const link = event.target.closest('a[data-page]');
    if (!embedded || !link || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    if (!pageNames.includes(link.dataset.page)) return;
    event.preventDefault();
    requestPage(link.dataset.page, link.dataset.anchor);
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
      target.closest('.board').scrollIntoView({behavior: 'auto', block: 'start'});
      if (message.anchor === 'marketplace' && message.page === 'home') {
        target.contentWindow.postMessage({type: 'ewise:scroll-anchor', anchor: 'marketplace'}, '*');
      }
    }
    if (embedded && event.source === window.parent && message.type === 'ewise:scroll-anchor' && message.anchor === 'marketplace') {
      const section = document.getElementById('marketplace');
      if (section) section.scrollIntoView({behavior: 'auto', block: 'start'});
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
