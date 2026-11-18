(function() {
  'use strict';
  const routes = {
    resell: {
      title: 'Resell', label: 'Estimated resale value', value: '₱18,000–₱20,000',
      note: 'Illustrative range, not a guaranteed sale price.',
      reason: 'Your phone’s core functions still work. Selling it whole has more estimated value than selling it for parts.',
      guidance: 'Buyers should see the camera fault in your title, description, and photos.',
      fixed: ['Add photos and describe the camera issue.', 'Choose your asking price.', 'Review your listing before publishing.'],
      bidding: ['Add photos and describe the camera issue.', 'Set up your bidding preferences.', 'Review the listing before opening it for offers.'],
    },
    repair: {
      title: 'Repair / Reuse', label: 'Repair estimate', value: 'Assessment needed',
      note: 'No repair quote or technician availability is provided in this preview.',
      reason: 'Prefer to keep your phone? A technician would need to assess the camera before you decide whether a repair is worthwhile.',
      guidance: 'Request an assessment before agreeing to a repair cost.',
      preparation: ['Back up your data before handing over your phone.', 'Describe when the camera stopped working and any previous repairs.'],
      next: 'Prepare a repair request',
      steps: ['Describe the camera issue and add device photos.', 'Review technician options and availability when offered.', 'Review an assessment and quote before confirming a repair.'],
    },
    salvage: {
      title: 'Salvage', label: 'Estimated salvage value', value: '₱3,000–₱5,000',
      note: 'Illustrative range, subject to a buyer’s inspection.',
      reason: 'Working components may still be useful to a technician or refurbisher. For this sample, selling the whole phone has a higher estimated return.',
      guidance: 'List the device for parts and disclose the camera issue. Do not promise that untested components work.',
      fixed: ['Mark the listing as a device for parts.', 'Disclose the camera fault and set an asking price.', 'Review the parts listing before publishing.'],
      bidding: ['Mark the listing as a device for parts.', 'Describe tested components and set bidding preferences.', 'Review the parts listing before opening it for offers.'],
    },
    dispose: {
      title: 'Dispose / Recycle', label: 'For this device', value: 'Reuse is recommended',
      note: 'No disposal payout, fee, or collection availability is estimated.',
      reason: 'This phone still has resale and reuse value, so disposal is not recommended for this sample. Consider it only if reuse, repair, and salvage are no longer suitable.',
      guidance: 'Check the receiving facility’s accepted devices and handling instructions before making arrangements.',
      preparation: ['Back up your data, then remove accounts and erase the device before handover.', 'Ask the receiving facility how to handle a damaged battery; do not dismantle it yourself.'],
      next: 'Prepare a recycling request',
      steps: ['Find a suitable receiving facility and check its accepted devices.', 'Confirm any fees and drop-off or collection arrangements.', 'Prepare the device and review the handover details.'],
    },
  };
  const get = id => document.getElementById(id);
  function list(id, items, tag) {
    get(id).replaceChildren(...items.map(text => {
      const item = document.createElement(tag);
      item.textContent = text;
      return item;
    }));
  }
  function update() {
    const key = document.querySelector('input[name="route"]:checked').value;
    const method = document.querySelector('input[name="method"]:checked').value;
    const route = routes[key];
    const selling = key === 'resell' || key === 'salvage';
    const next = get('continue-transact');
    next.href = 'transact.html?route=' + key + '&method=' + method;
    next.dataset.route = key;
    next.dataset.method = method;
    get('selling-methods').hidden = !selling;
    get('selling-methods').disabled = !selling;
    get('service-preparation').hidden = selling;
    get('route-reason').textContent = route.reason;
    get('route-guidance').textContent = route.guidance;
    get('selection-title').textContent = route.title + (selling ? ' · ' + (method === 'fixed' ? 'Fixed price' : 'Open for bids') : '');
    get('estimate-label').textContent = route.label;
    get('estimate').textContent = route.value;
    get('estimate').style.fontSize = selling ? '' : '20px';
    get('estimate').style.color = selling ? '' : '#0B0B0B';
    get('estimate-note').textContent = route.note;
    if (!selling) {
      get('preparation-title').textContent = key === 'repair' ? 'Before a repair assessment' : 'Before a recycling handover';
      list('preparation-list', route.preparation, 'li');
    }
    get('next-title').textContent = selling
      ? (key === 'salvage' ? 'Create a parts listing' : method === 'fixed' ? 'Create a fixed-price listing' : 'Create a bidding listing')
      : route.next;
    list('next-list', selling ? route[method] : route.steps, 'li');
    get('next-preview').open = false;
  }
  document.querySelectorAll('input[name="route"], input[name="method"]').forEach(input => input.addEventListener('change', update));
  function restore(chosen) {
    if (!chosen || !Object.hasOwn(routes, chosen.route)) return;
    document.querySelector('input[name="route"][value="' + chosen.route + '"]').checked = true;
    document.querySelector('input[name="method"][value="' + (chosen.method === 'bidding' ? 'bidding' : 'fixed') + '"]').checked = true;
    update();
  }
  const params = new URLSearchParams(window.location.search);
  restore({route: params.get('route'), method: params.get('method')});
  document.addEventListener('ewise:selection', event => restore(event.detail));
  update();
})();
