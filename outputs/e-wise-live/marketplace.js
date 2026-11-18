(function() {
  'use strict';
  const products = window.EwiseCatalog;
  const categories = {smartphones:'Smartphones',laptops:'Laptops',tablets:'Tablets',printers:'Printers',monitors:'Monitors',desktops:'Desktops',audio:'Audio',gaming:'Gaming',cameras:'Cameras',accessories:'Accessories'};
  const sales = {fixed:'Fixed price',bidding:'Open for bids',parts:'For parts'};
  const get = id => document.getElementById(id);
  const filters = get('filter-body');
  const search = get('catalog-search');
  const min = get('price-min'), max = get('price-max');
  const money = amount => new Intl.NumberFormat('en-PH',{style:'currency',currency:'PHP',maximumFractionDigits:0}).format(amount);
  const groups = {category:categories,sale:sales,brand:Object.fromEntries([...new Set(products.map(p=>p.brand))].sort().map(value=>[value,value])),condition:{Excellent:'Excellent',Good:'Good',Fair:'Fair',Damaged:'Damaged'},classification:{Resellable:'Resellable',Repairable:'Repairable',Salvageable:'Salvageable'}};
  const icons = {
    down:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m5 9 7 7 7-7"/></svg>',
    close:'<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>'
  };
  const selected = name => Array.from(filters.querySelectorAll('input[name="'+name+'"]:checked')).map(input=>input.value);

  Object.entries(groups).forEach(([name, options]) => {
    const parent = get(name+'-options');
    Object.entries(options).forEach(([value,label]) => {
      const row = document.createElement('label');
      row.className = 'filter-option';
      const text = document.createElement('span'), input = document.createElement('input'), count = document.createElement('span');
      input.type = 'checkbox'; input.name = name; input.value = value;
      text.append(input, document.createTextNode(label));
      count.className = 'option-count'; count.setAttribute('aria-hidden','true');
      count.dataset.group = name; count.dataset.value = value;
      count.textContent = products.filter(product=>product[name]===value).length;
      row.append(text,count); parent.append(row);
    });
  });

  function chip(label, remove) {
    const button = document.createElement('button'), text = document.createElement('span');
    button.type = 'button'; button.className = 'filter-chip';
    button.setAttribute('aria-label','Remove filter: '+label);
    text.textContent = label; button.append(text); button.insertAdjacentHTML('beforeend',icons.close);
    button.addEventListener('click',()=>{
      const position = Array.from(get('active-filters').children).indexOf(button);
      remove(); render();
      const remaining = get('active-filters').children;
      (remaining[Math.min(position,remaining.length-1)] || search).focus();
    });
    return button;
  }
  function card(product) {
    const article = document.createElement('article');
    article.className = 'product-card'; article.dataset.id = product.id; article.dataset.price = product.price;
    // All interpolated strings below are authored sample catalog entries, never user input.
    article.innerHTML = '<div class="product-visual" aria-hidden="true">'+window.EwiseDeviceVisual(product)+'</div>'+
      '<div class="product-tags"><span class="tag '+product.classification.toLowerCase()+'">'+product.classification+'</span><span class="sale-type">'+sales[product.sale]+'</span></div>'+
      '<h3>'+product.name+'</h3><p class="product-meta">'+product.condition+' · '+product.storage+'<br>'+product.age+' old</p>'+
      '<p class="price">'+money(product.price)+'</p><p class="price-note">'+(product.sale==='bidding'?'Sample starting price':'Sample asking price')+'</p>'+
      '<p class="condition-note">'+product.issue+'</p><a class="buyer-action" href="buyer.html?listing='+product.id+'" data-page="buyer" data-listing="'+product.id+'" aria-label="'+(product.sale==='bidding'?'Place a bid on ':'Make an offer on ')+product.name+'">'+(product.sale==='bidding'?'Place a bid':'Make an offer')+' →</a><details class="listing-details"><summary>View sample listing '+icons.down+'</summary><div class="listing-copy"><p><strong>Device details</strong><br>'+product.description+'</p><p><strong>Known condition</strong><br>'+product.issue+'</p><p>Sample preview only. Offer and bid submissions run as demos; no seller is contacted.</p></div></details>';
    return article;
  }
  function render() {
    const query = search.value.trim().toLowerCase();
    const chosen = Object.fromEntries(Object.keys(groups).map(name=>[name,selected(name)]));
    const floor = min.value==='' ? 0 : min.valueAsNumber;
    const ceiling = max.value==='' ? Infinity : max.valueAsNumber;
    const invalid = !min.validity.valid || !max.validity.valid || !Number.isFinite(floor) || Number.isNaN(ceiling) || floor>ceiling;
    get('price-error').textContent = invalid ? 'Use whole amounts of ₱0 or more, with the minimum no higher than the maximum.' : '';
    min.setAttribute('aria-invalid',String(invalid)); max.setAttribute('aria-invalid',String(invalid));
    function matches(product, excluding) {
      const haystack = [product.name,product.brand,categories[product.category],product.condition,product.classification,product.storage,product.issue].join(' ').toLowerCase();
      return !invalid && (!query || query.split(/\s+/).every(word=>haystack.includes(word))) && product.price>=floor && product.price<=ceiling && Object.entries(chosen).every(([name,values])=>name===excluding||!values.length||values.includes(product[name]));
    }
    const results = products.filter(product=>matches(product));
    filters.querySelectorAll('.option-count').forEach(count=>{
      count.textContent = products.filter(product=>matches(product,count.dataset.group)&&product[count.dataset.group]===count.dataset.value).length;
    });
    const sort = get('sort').value;
    if(sort==='price-low') results.sort((a,b)=>a.price-b.price);
    if(sort==='price-high') results.sort((a,b)=>b.price-a.price);
    if(sort==='newest') results.reverse();
    const chips = [];
    if(query) chips.push(chip('Search: '+search.value.trim(),()=>search.value=''));
    Object.entries(chosen).forEach(([name,values])=>values.forEach(value=>chips.push(chip(groups[name][value],()=>{filters.querySelector('input[name="'+name+'"][value="'+value+'"]').checked=false;}))));
    if(min.value!=='') chips.push(chip('Min: '+(min.validity.valid?money(floor):min.value),()=>min.value=''));
    if(max.value!=='') chips.push(chip('Max: '+(max.validity.valid?money(ceiling):max.value),()=>max.value=''));
    get('active-filters').replaceChildren(...chips);
    get('clear-filters').disabled = chips.length===0;
    get('filter-toggle-label').textContent = 'Filters'+(chips.length?' ('+chips.length+')':'');
    get('results-count').replaceChildren();
    const count = document.createElement('strong'); count.textContent=results.length;
    get('results-count').append(count,document.createTextNode(' sample listing'+(results.length===1?'':'s')));
    get('product-grid').replaceChildren(...results.map(card));
    get('empty-state').hidden = results.length>0;
    get('empty-state').querySelector('h2').textContent = invalid ? 'Check your price range.' : 'No devices match just yet.';
    get('result-footnote').textContent = results.length ? 'You’ve seen all '+results.length+' matching sample listing'+(results.length===1?'.':'s.') : 'No matching sample listings.';
    document.querySelectorAll('.category-nav button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.category==='all'?!chosen.category.length:chosen.category.length===1&&chosen.category[0]===button.dataset.category)));
  }
  function reset() { filters.reset(); search.value=''; render(); }
  function preset(value) {
    filters.reset(); search.value=typeof value.q==='string'?value.q.slice(0,100):'';
    if(Object.hasOwn(categories,value.category)) filters.querySelector('input[name="category"][value="'+value.category+'"]').checked=true;
    render();
  }
  filters.addEventListener('submit',event=>event.preventDefault());
  filters.addEventListener('input',render);
  search.addEventListener('input',render);
  get('search-form').addEventListener('submit',event=>{event.preventDefault(); render();});
  get('sort').addEventListener('change',render);
  get('clear-filters').addEventListener('click',reset);
  get('empty-reset').addEventListener('click',reset);
  document.querySelectorAll('.category-nav button').forEach(button=>button.addEventListener('click',()=>{
    filters.querySelectorAll('input[name="category"]').forEach(input=>input.checked=input.value===button.dataset.category);
    render();
  }));
  const mobile = window.matchMedia('(max-width:760px)');
  function adaptFilters() {
    filters.hidden = mobile.matches;
    get('filter-toggle').setAttribute('aria-expanded',String(!mobile.matches));
  }
  get('filter-toggle').addEventListener('click',()=>{
    filters.hidden=!filters.hidden;
    get('filter-toggle').setAttribute('aria-expanded',String(!filters.hidden));
  });
  mobile.addEventListener('change',adaptFilters); adaptFilters();
  document.addEventListener('ewise:browse',event=>preset(event.detail||{}));
  const params = new URLSearchParams(window.location.search);
  preset({category:params.get('category'),q:params.get('q')});
})();
