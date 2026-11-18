(function() {
  'use strict';
  const get = id => document.getElementById(id);
  const form = get('proposal-form');
  const catalog = window.EwiseCatalog;
  const money = amount => new Intl.NumberFormat('en-PH', {style:'currency', currency:'PHP', maximumFractionDigits:0}).format(amount);
  let product, bidding, stage = 'edit';

  function facts(id, values) {
    get(id).replaceChildren(...values.map(([label, value]) => {
      const row = document.createElement('div'), term = document.createElement('dt'), detail = document.createElement('dd');
      term.textContent = label; detail.textContent = value;
      row.append(term, detail);
      return row;
    }));
  }
  function amountValid() {
    if (!product) return false;
    const amount = get('amount').valueAsNumber;
    return Number.isSafeInteger(amount) && amount >= (bidding ? product.price : 1) && amount <= 9999999;
  }
  function updateAmount() {
    get('your-amount').textContent = amountValid() ? money(get('amount').valueAsNumber) : 'Not entered';
  }
  function showStage(next, focus) {
    stage = next;
    form.hidden = next !== 'edit';
    get('review').hidden = next !== 'review';
    get('confirmation').hidden = next !== 'complete';
    const active = next === 'edit' ? 0 : next === 'review' ? 1 : 2;
    Array.from(get('flow-stages').children).forEach((item, index) => {
      if (index === active) item.setAttribute('aria-current','step');
      else item.removeAttribute('aria-current');
      item.classList.toggle('done',index < active);
    });
    get('page-title').textContent = next === 'edit' ? (bidding ? 'Place your bid.' : 'Make your offer.') : next === 'review' ? (bidding ? 'Review your bid.' : 'Review your offer.') : 'Your preview is ready.';
    get('page-intro').textContent = next === 'edit' ? (bidding ? 'Choose your bid for this sample listing, review it, and try the demo submission.' : 'Choose your amount, review the device’s condition, and check your offer before completing the demo.') : next === 'review' ? 'Check the amount and device details. You can go back to edit before completing the demo.' : 'You’ve completed the sample buyer flow. Nothing has been sent or paid.';
    if (focus) (next === 'edit' ? get('amount') : get('page-title')).focus();
  }
  function configure(id) {
    const found = catalog.find(item => item.id === id);
    if (found && product && found.id === product.id) return;
    product = found;
    get('not-found').hidden = !!product;
    get('buyer-layout').hidden = !product;
    get('flow-stages').hidden = !product;
    if (!product) {
      document.title = 'Listing unavailable — E-wise';
      get('page-title').textContent = 'Listing not found.';
      get('page-intro').textContent = 'Choose a device from the sample marketplace to start an offer or bid.';
      get('breadcrumb-action').textContent = 'Listing unavailable';
      return;
    }
    bidding = product.sale === 'bidding';
    form.reset();
    get('amount').min = bidding ? product.price : 1;
    get('amount').placeholder = String(product.price);
    get('amount').setCustomValidity('');
    get('amount').removeAttribute('aria-invalid');
    get('amount-error').textContent = '';
    get('form-error').textContent = '';
    const noun = bidding ? 'bid' : 'offer';
    document.title = (bidding ? 'Place a bid' : 'Make an offer') + ' — E-wise';
    get('breadcrumb-action').textContent = bidding ? 'Place a bid' : 'Make an offer';
    get('form-title').textContent = bidding ? 'What would you like to bid?' : 'What would you like to offer?';
    get('amount-context').textContent = bidding ? 'This sample listing starts at ' + money(product.price) + '.' : 'The seller’s sample asking price is ' + money(product.price) + '.';
    get('amount-label').textContent = 'Your ' + noun + ' (PHP)';
    get('amount-hint').textContent = bidding ? 'For this demo, enter ' + money(product.price) + ' or more in whole pesos. No live auction data is connected.' : 'Enter a positive whole-peso amount for this demo. The seller has not agreed to this amount.';
    get('message-field').hidden = bidding;
    get('message').disabled = bidding;
    get('form-condition').textContent = product.issue;
    get('review-button').textContent = 'Review my ' + noun + ' →';
    get('review-heading').textContent = 'Check your ' + noun + '.';
    get('review-copy').textContent = 'Your proposed ' + noun;
    get('submit-demo').textContent = bidding ? 'Place demo bid →' : 'Submit demo offer →';
    get('review-note').textContent = bidding ? 'This preview leaves live bids and auction outcomes unchanged.' : 'Completing this preview does not send an offer to a seller.';
    get('confirmation-heading').textContent = 'Your ' + noun + ' preview is ready.';
    get('next-step-copy').textContent = bidding ? 'In a live auction, its outcome would need to be confirmed before any payment or handover. This preview does not mean you’ve won or secured the device.' : 'In a live transaction, the seller would review your offer. Agreement, payment, and handover would be separate steps. This preview does not reserve the device.';
    get('device-shape').className = 'device-art-wrap';
    get('device-shape').innerHTML = window.EwiseDeviceVisual(product);
    get('classification').className = 'tag ' + product.classification.toLowerCase();
    get('classification').textContent = product.classification;
    get('device-name').textContent = product.name;
    get('device-meta').textContent = product.condition + ' · ' + product.storage + ' · ' + product.age + ' old';
    get('listing-price').textContent = money(product.price);
    get('price-label').textContent = bidding ? 'Sample starting price' : 'Sample asking price';
    get('listing-type').textContent = bidding ? 'Open for bids' : product.sale === 'parts' ? 'For parts' : 'Fixed price';
    get('form-listing').textContent = product.name + ' · ' + get('listing-type').textContent;
    get('listing-condition').textContent = product.issue;
    get('proposal-label').textContent = 'Your ' + noun;
    updateAmount();
    showStage('edit',false);
  }
  get('amount').addEventListener('input', () => {
    get('amount').setCustomValidity('');
    get('amount').removeAttribute('aria-invalid');
    get('amount-error').textContent = '';
    get('form-error').textContent = '';
    updateAmount();
  });
  get('acknowledge').addEventListener('change', () => { get('form-error').textContent = ''; });
  form.addEventListener('submit',event => {
    event.preventDefault();
    if (!product || stage !== 'edit') return;
    const valid = amountValid();
    const error = bidding ? 'Enter a whole-peso bid from ' + money(product.price) + ' to ₱9,999,999 for this demo.' : 'Enter a whole-peso offer from ₱1 to ₱9,999,999.';
    get('amount').setCustomValidity(valid ? '' : error);
    get('amount').setAttribute('aria-invalid', String(!valid));
    get('amount-error').textContent = valid ? '' : error;
    if (!form.reportValidity()) {
      get('form-error').textContent = valid ? 'Confirm that you’ve reviewed the disclosed condition before continuing.' : 'Check your amount before reviewing the proposal.';
      return;
    }
    const values = [['Device', product.name], ['Listing type', get('listing-type').textContent], [bidding ? 'Sample starting price' : 'Sample asking price', money(product.price)], ['Known condition', product.issue], ['Handover preference', get('handover').value]];
    facts('review-facts',values);
    get('review-amount').textContent = money(get('amount').valueAsNumber);
    const message = get('message').value.trim();
    get('review-message').textContent = message;
    get('review-message').hidden = bidding || !message;
    showStage('review',true);
  });
  get('submit-demo').addEventListener('click', () => {
    if (!product || stage !== 'review') return;
    facts('confirmation-facts',[['Device',product.name],[bidding ? 'Demo bid' : 'Demo offer',money(get('amount').valueAsNumber)],['Known condition',product.issue]]);
    get('confirmation-copy').textContent = bidding ? 'Your demo bid for ' + product.name + ' is ' + money(get('amount').valueAsNumber) + '. No live bid was placed and no payment was taken.' : 'Your demo offer for ' + product.name + ' is ' + money(get('amount').valueAsNumber) + '. No offer was sent to a seller and no payment was taken.';
    showStage('complete',true);
  });
  for (const id of ['edit-proposal','edit-again']) get(id).addEventListener('click', () => showStage('edit',true));
  document.addEventListener('ewise:listing', event => configure(event.detail));
  const params = new URLSearchParams(window.location.search);
  configure(params.has('listing') ? params.get('listing') : 'iphone-13');
})();
