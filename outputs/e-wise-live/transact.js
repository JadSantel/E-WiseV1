(function() {
  'use strict';
  const get = id => document.getElementById(id);
  const form = get('transaction-form');
  const configs = {
    resell: {name: 'Resell', heading: 'Create your listing.', title: 'Apple iPhone 13 · 128 GB — camera fault', price: 19000, estimate: 'Illustrative resale estimate: ₱18,000–₱20,000.', description: 'Apple iPhone 13, 128 GB, in good physical condition. The phone powers on and its screen, touch controls, buttons, and ports work. The camera is not working. Sold as-is with the camera fault disclosed.'},
    salvage: {name: 'Salvage', heading: 'List it for parts.', title: 'For parts: Apple iPhone 13 · 128 GB', price: 4000, estimate: 'Illustrative salvage estimate: ₱3,000–₱5,000.', description: 'Apple iPhone 13, 128 GB, offered as a whole device for parts. The camera is not working. The phone powers on, with working screen, touch controls, buttons, and ports. Other components should be inspected by the buyer.'},
    repair: {name: 'Repair / Reuse', heading: 'Prepare your repair.', title: 'Camera assessment for Apple iPhone 13', description: 'Apple iPhone 13, 128 GB. The camera is not working; the phone powers on and its core functions work. I would like an assessment and quote before deciding on a repair.'},
    dispose: {name: 'Dispose / Recycle', heading: 'Plan its next stop.', title: 'Recycling inquiry for Apple iPhone 13', description: 'Apple iPhone 13, 128 GB, with a camera fault. The device still has resale and reuse value. I am exploring accepted devices and handover requirements before deciding whether recycling is suitable.'},
  };
  let chosen, config, selling, photos = [];
  const money = value => new Intl.NumberFormat('en-PH', {style: 'currency', currency: 'PHP', maximumFractionDigits: 0}).format(value);
  const routeText = () => config.name + (selling ? ' · ' + (chosen.method === 'bidding' ? 'Open for bids' : 'Fixed price') : '');

  function setStage(next) {
    form.hidden = next !== 'edit';
    get('review').hidden = next !== 'review';
    get('completion').hidden = next !== 'complete';
    get('review-button').hidden = next !== 'edit';
    get('complete-demo').hidden = next !== 'review';
    get('page-title').textContent = next === 'edit' ? config.heading : next === 'review' ? (selling ? 'Review your listing.' : 'Review your request.') : 'Your preview is ready.';
    get('page-intro').textContent = next === 'edit'
      ? selling ? 'Give your iPhone 13 a clear, honest listing. Review the details before taking the next step.' : 'Describe what you need for your iPhone 13. Review a sample request before making any arrangements.'
      : next === 'review' ? 'Your device, your choice. Make sure the details tell the whole story.' : 'You’ve reached the end of the sample flow. Your device details are still here to explore.';
    get('action-note').textContent = next === 'review' ? 'Demo only. No listing or request will be sent.' : next === 'complete' ? 'Demo complete. Nothing was published, booked, or submitted.' : selling ? 'Next: review your details. This sample won’t appear in the marketplace.' : 'Next: review your request. No provider will receive it.';
  }

  function updatePreview() {
    get('preview-title').textContent = get('listing-title').value.trim() || (selling ? 'Your listing title' : 'Your request title');
    const amount = get('price').valueAsNumber;
    get('preview-price').textContent = selling ? (Number.isFinite(amount) && amount >= 1 && amount <= 9999999 ? money(amount) : 'Set a valid price') : 'Assessment needed';
    get('preview-price').style.color = selling ? '' : '#0B0B0B';
    get('preview-price').style.fontSize = selling ? '' : '22px';
    get('preview-duration').textContent = get('duration').value;
    get('preview-area').textContent = get('area').value.trim() || 'Area to add';
  }

  function renderPhotos() {
    for (const id of ['photos', 'review-photos']) {
      get(id).replaceChildren(...photos.map((photo, index) => {
        const item = document.createElement('div');
        item.className = 'photo-item';
        const img = document.createElement('img');
        img.src = photo.url;
        img.alt = 'Device photo ' + (index + 1);
        item.append(img);
        if (id === 'photos') {
          const remove = document.createElement('button');
          remove.type = 'button';
          remove.textContent = 'Remove photo ' + (index + 1);
          remove.addEventListener('click', () => {
            URL.revokeObjectURL(photo.url);
            photos.splice(index, 1);
            renderPhotos();
            get('photo-input').focus();
          });
          item.append(remove);
        }
        return item;
      }));
      get(id).hidden = photos.length === 0;
    }
    get('photo-empty').hidden = photos.length > 0;
    get('preview-placeholder').hidden = photos.length > 0;
    get('preview-photo').hidden = photos.length === 0;
    get('preview-photo').replaceChildren();
    if (photos.length) {
      const img = document.createElement('img');
      img.src = photos[0].url;
      img.alt = 'First selected device photo';
      get('preview-photo').append(img);
    }
  }

  function configure(value) {
    const route = value && Object.hasOwn(configs, value.route) ? value.route : 'resell';
    const method = value && value.method === 'bidding' ? 'bidding' : 'fixed';
    if (chosen && chosen.route === route && chosen.method === method) return;
    chosen = {route, method};
    config = configs[route];
    selling = route === 'resell' || route === 'salvage';
    form.reset();
    get('listing-title').value = config.title;
    get('description').value = config.description;
    get('price').value = config.price || '';
    get('sale-fields').hidden = !selling;
    get('price').disabled = !selling;
    get('duration-field').hidden = !selling || method !== 'bidding';
    get('duration').disabled = !selling || method !== 'bidding';
    get('area-field').hidden = selling;
    get('area').disabled = selling;
    get('area').required = !selling;
    get('preview-duration-row').hidden = !selling || method !== 'bidding';
    get('preview-area-row').hidden = selling;
    get('details-heading').textContent = selling ? 'Listing details' : 'Request details';
    get('title-label').textContent = selling ? 'Listing title' : 'Request title';
    get('preferences-heading').textContent = selling ? 'Price & handover' : 'Request preferences';
    get('price-label').textContent = method === 'bidding' ? 'Starting price' : 'Asking price';
    get('price-hint').textContent = (config.estimate || '') + (method === 'bidding' ? ' Set a sample starting price.' : ' Choose your own asking price.');
    get('handover-hint').textContent = selling ? 'A preference only. Arrangements would be agreed with the buyer.' : 'A preference only. Availability, quotes, and arrangements would need confirmation.';
    const options = selling ? ['Discuss with buyer', 'Prefer meet-up', 'Prefer delivery'] : ['Discuss with receiving provider', 'Prefer drop-off', 'Prefer collection'];
    get('handover').replaceChildren(...options.map(text => new Option(text, text)));
    get('preview-heading').textContent = selling ? 'Your listing preview' : 'Your request preview';
    get('preview-route').textContent = routeText();
    get('preview-price-label').textContent = selling ? method === 'bidding' ? 'Sample starting price' : 'Sample asking price' : route === 'repair' ? 'No repair quote or appointment is confirmed.' : 'No fee, payout, or collection is confirmed.';
    get('review-button').textContent = selling ? 'Review listing →' : 'Review request →';
    get('completion-title').textContent = selling ? 'Your listing preview is ready.' : 'Your request preview is ready.';
    get('completion-copy').textContent = selling ? 'You’ve completed the sample listing flow. Nothing has been published and no payment has been taken.' : 'You’ve completed the sample request flow. Nothing was sent to a provider, and no booking or collection has been made.';
    document.querySelectorAll('.route-back').forEach(link => {
      link.href = 'routing.html?route=' + route + '&method=' + method;
      link.dataset.route = route;
      link.dataset.method = method;
    });
    get('form-error').textContent = '';
    get('photo-error').textContent = '';
    setStage('edit');
    updatePreview();
  }

  get('photo-input').addEventListener('change', async function() {
    const files = Array.from(this.files);
    this.value = '';
    get('photo-error').textContent = '';
    if (photos.length + files.length > 4 || files.some(file => !['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024)) {
      get('photo-error').textContent = 'Choose up to 4 JPG, PNG, or WebP images, no larger than 5 MB each. Your existing photos are unchanged.';
      return;
    }
    const candidates = files.map(file => ({url: URL.createObjectURL(file)}));
    this.disabled = true;
    get('review-button').disabled = true;
    get('photo-status').hidden = false;
    get('photo-status').textContent = 'Checking photos…';
    try {
      await Promise.all(candidates.map(async photo => {
        const img = new Image();
        img.src = photo.url;
        await img.decode();
      }));
      photos.push(...candidates);
      renderPhotos();
    } catch {
      candidates.forEach(photo => URL.revokeObjectURL(photo.url));
      get('photo-error').textContent = 'One of these images could not be opened. Choose valid JPG, PNG, or WebP files. Your existing photos are unchanged.';
    } finally {
      this.disabled = false;
      get('review-button').disabled = false;
      get('photo-status').hidden = true;
    }
  });
  form.addEventListener('input', () => {
    get('listing-title').setCustomValidity('');
    get('description').setCustomValidity('');
    get('area').setCustomValidity('');
    get('form-error').textContent = '';
    updatePreview();
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    for (const id of ['listing-title', 'description', 'area']) {
      const input = get(id);
      input.setCustomValidity(!input.disabled && input.required && !input.value.trim() ? 'Enter ' + (id === 'listing-title' ? 'a title.' : id === 'description' ? 'a description.' : 'a city or municipality.') : '');
    }
    if (!form.reportValidity()) {
      get('form-error').textContent = 'Check the highlighted field and confirm that you’ve included the camera fault.';
      return;
    }
    get('review-title').textContent = get('listing-title').value.trim();
    get('review-description').textContent = get('description').value.trim();
    const facts = [['Selected route', routeText()], ['Device', 'Apple iPhone 13 · 128 GB'], ['Classification', 'Resellable'], ['Known issue', 'Camera not working']];
    if (selling) facts.push([chosen.method === 'bidding' ? 'Starting price' : 'Asking price', money(get('price').valueAsNumber)]);
    if (selling && chosen.method === 'bidding') facts.push(['Bidding duration', get('duration').value]);
    if (!selling) facts.push(['Area', get('area').value.trim()]);
    facts.push(['Handover preference', get('handover').value], ['Device photos', photos.length ? photos.length + ' local photo(s)' : 'No photos added']);
    get('review-facts').replaceChildren(...facts.map(([label, value]) => {
      const row = document.createElement('div'), term = document.createElement('dt'), detail = document.createElement('dd');
      term.textContent = label;
      detail.textContent = value;
      row.append(term, detail);
      return row;
    }));
    setStage('review');
    get('page-title').focus();
  });
  get('complete-demo').addEventListener('click', () => { setStage('complete'); get('page-title').focus(); });
  for (const id of ['edit-details', 'edit-again']) get(id).addEventListener('click', () => { setStage('edit'); get('listing-title').focus(); });
  document.addEventListener('ewise:selection', event => configure(event.detail));
  const params = new URLSearchParams(window.location.search);
  configure({route: params.get('route'), method: params.get('method')});
})();
