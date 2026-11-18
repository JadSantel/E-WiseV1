(function() {
  'use strict';
  const products = [
    {id:'iphone-13',name:'Apple iPhone 13',brand:'Apple',category:'smartphones',condition:'Good',classification:'Resellable',sale:'fixed',storage:'128 GB',age:'2 years',price:18500,issue:'Camera not working; other core functions work.',description:'Offered as-is with the camera fault disclosed. Review the device condition before considering a purchase.'},
    {id:'galaxy-s21',name:'Samsung Galaxy S21',brand:'Samsung',category:'smartphones',condition:'Fair',classification:'Resellable',sale:'bidding',storage:'256 GB',age:'3 years',price:9000,issue:'Visible frame wear; screen and touch working.',description:'A sample bidding listing for a working device with cosmetic wear. The displayed amount is a starting price.'},
    {id:'iphone-11',name:'Apple iPhone 11',brand:'Apple',category:'smartphones',condition:'Damaged',classification:'Salvageable',sale:'parts',storage:'64 GB',age:'4 years',price:2500,issue:'Won’t power on; screen appears intact.',description:'Offered as a whole device for parts. Internal components are untested and would need inspection.'},
    {id:'redmi-note-12',name:'Xiaomi Redmi Note 12',brand:'Xiaomi',category:'smartphones',condition:'Good',classification:'Resellable',sale:'fixed',storage:'128 GB',age:'1 year',price:5500,issue:'Minor case marks; core functions working.',description:'A sample second-hand device with ordinary signs of use. Photos and device details would need confirmation.'},
    {id:'macbook-air',name:'Apple MacBook Air M1',brand:'Apple',category:'laptops',condition:'Good',classification:'Resellable',sale:'fixed',storage:'256 GB · 8 GB RAM',age:'3 years',price:29500,issue:'Light lid scratches; keyboard and display working.',description:'A sample laptop listing for everyday work and study. Battery condition would need assessment by the buyer.'},
    {id:'thinkpad-t14',name:'Lenovo ThinkPad T14',brand:'Lenovo',category:'laptops',condition:'Fair',classification:'Repairable',sale:'fixed',storage:'512 GB · 16 GB RAM',age:'4 years',price:12500,issue:'Battery needs replacement; works on charger.',description:'A repair project with its battery issue disclosed. Any repair cost is separate and is not estimated here.'},
    {id:'ipad-9',name:'Apple iPad 9th generation',brand:'Apple',category:'tablets',condition:'Good',classification:'Resellable',sale:'fixed',storage:'64 GB',age:'2 years',price:11500,issue:'Small case marks; display and touch working.',description:'A sample tablet listing. Included accessories and exact condition would need confirmation before purchase.'},
    {id:'sony-wh',name:'Sony WH-1000XM4',brand:'Sony',category:'audio',condition:'Fair',classification:'Resellable',sale:'fixed',storage:'Wireless headphones',age:'2 years',price:6500,issue:'Worn ear cushions; audio and Bluetooth working.',description:'A sample audio listing with cushion wear disclosed. No replacement accessories or warranty are promised.'},
    {id:'switch-lite',name:'Nintendo Switch Lite',brand:'Nintendo',category:'gaming',condition:'Good',classification:'Resellable',sale:'bidding',storage:'32 GB',age:'2 years',price:5000,issue:'Minor shell wear; buttons and sticks working.',description:'A sample console listing open for bids. Games and accessories are not included in this illustrative listing.'},
    {id:'galaxy-a54',name:'Samsung Galaxy A54',brand:'Samsung',category:'smartphones',condition:'Excellent',classification:'Resellable',sale:'fixed',storage:'128 GB',age:'1 year',price:10500,issue:'Light signs of use; core functions working.',description:'A sample device in excellent physical condition. This is not a certified refurbishment or warranty claim.'},
    {id:'asus-vivobook',name:'ASUS VivoBook 15',brand:'ASUS',category:'laptops',condition:'Damaged',classification:'Salvageable',sale:'parts',storage:'256 GB · 8 GB RAM',age:'5 years',price:3500,issue:'Cracked display; powers on with external monitor.',description:'Offered as a whole laptop for parts or assessment. Untested components should not be assumed to work.'},
    {id:'iphone-12-mini',name:'Apple iPhone 12 mini',brand:'Apple',category:'smartphones',condition:'Fair',classification:'Repairable',sale:'bidding',storage:'64 GB',age:'3 years',price:7500,issue:'Charging port intermittent; screen working.',description:'A sample repair project open for bids. A technician would need to assess the charging fault and any repair cost.'},
  ];
  const categories = {smartphones:'Smartphones',laptops:'Laptops',tablets:'Tablets',audio:'Audio',gaming:'Gaming'};
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
    article.innerHTML = '<div class="product-visual" aria-hidden="true"><div class="device '+product.category+'"></div></div>'+
      '<div class="product-tags"><span class="tag '+product.classification.toLowerCase()+'">'+product.classification+'</span><span class="sale-type">'+sales[product.sale]+'</span></div>'+
      '<h3>'+product.name+'</h3><p class="product-meta">'+product.condition+' · '+product.storage+'<br>'+product.age+' old</p>'+
      '<p class="price">'+money(product.price)+'</p><p class="price-note">'+(product.sale==='bidding'?'Sample starting price':'Sample asking price')+'</p>'+
      '<p class="condition-note">'+product.issue+'</p><details class="listing-details"><summary>View sample listing '+icons.down+'</summary><div class="listing-copy"><p><strong>Device details</strong><br>'+product.description+'</p><p><strong>Known condition</strong><br>'+product.issue+'</p><p>Sample preview only. Buying, offers, and bidding are not available here.</p></div></details>';
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
