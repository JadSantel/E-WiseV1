(function() {
  'use strict';
  // Authored, decorative mock devices; the adjacent listing describes actual sample condition.
  window.EwiseDeviceVisual = function(product) {
    const damage = product.visual || '';
    const crack = '<g fill="none" stroke="#e6edf0" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"><path d="m151 38-23 27 10 18-28 28 5 25M128 65l-29-8-15-17M138 83l29-7 15 13M110 111l-24-4-12 14M128 65l-3-22 8-14M138 83l-8 20 23 23M99 57l-2 20-14 10"/><path d="m151 38-4 19 14 6M115 136l15-15M99 57l-16 2" opacity=".6"/></g>';
    const screen = (x,y,w,h) => '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3" fill="'+(damage==='cracked'?'#25323a':'#34434b')+'"/>';
    const crackedScreen = (x,y,w,h,extra='') => '<defs><clipPath id="screen-'+product.id+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="3"/></clipPath></defs><g clip-path="url(#screen-'+product.id+')">'+extra+crack+'</g>';
    let shape = '';
    switch(product.category) {
      case 'smartphones':
      case 'tablets': {
        const tablet = product.category==='tablets';
        const x = tablet?68:82, width = tablet?104:76;
        shape = '<rect x="'+x+'" y="12" width="'+width+'" height="142" rx="12" fill="#737d80"/><rect x="'+(x+2)+'" y="14" width="'+(width-4)+'" height="138" rx="10" fill="#171c20"/>'+screen(x+6,21,width-12,124)+'<rect x="107" y="22" width="26" height="5" rx="2.5" fill="#101719"/>';
        if(damage==='cracked') shape += crackedScreen(x+6,21,width-12,124);
        else shape += '<path d="m'+(x+9)+' 118 '+(width-18)+'-66v89H'+(x+9)+'Z" fill="#738c92" opacity=".17"/>';
        if(damage==='camera') shape += '<circle cx="120" cy="25" r="3" fill="#b7c5c9"/><path d="m116 21 8 8" stroke="#171c20" stroke-width="2"/>';
        if(product.condition==='Fair') shape += '<path d="M84 44v22m71 54v15" stroke="#c0bdb1" stroke-width="1.4"/>';
        break;
      }
      case 'laptops':
        shape = '<rect x="40" y="25" width="160" height="106" rx="7" fill="#7b8589"/><rect x="43" y="28" width="154" height="100" rx="4" fill="#171c20"/>'+screen(48,33,144,88)+'<path d="m40 131-17 13q0 6 9 6h176q9 0 9-6l-17-13Z" fill="#a9b0b1"/><path d="M25 144h190" stroke="#737d80" stroke-width="2"/><path d="m98 132-3 7h50l-3-7" fill="#7b8589"/>';
        if(damage==='cracked') shape += crackedScreen(48,33,144,88,'<path d="m159 33-18 24 10 35 40 12V33Z" fill="#0c1013"/><path d="M186 38v70m-4-70v64" stroke="#a9b8a2" stroke-width="1"/>');
        break;
      case 'monitors':
        shape = '<path d="M110 119h20v27l27 7H83l27-7Z" fill="#7b8589"/><rect x="24" y="21" width="192" height="108" rx="6" fill="#353d42"/>'+screen(30,27,180,94)+'<circle cx="204" cy="125" r="1.5" fill="#a6b784"/>';
        if(damage==='cracked') shape += crackedScreen(30,27,180,94,'<path d="m167 27-28 30 8 32 63 18V27Z" fill="#111719"/><path d="M184 29v76m5-76v77m-10-77v74" stroke="#94a6af" stroke-width="1"/>');
        break;
      case 'printers':
        shape = '<path d="M51 65 65 44h111l15 21" fill="#c8cdcb"/><rect x="43" y="65" width="154" height="76" rx="10" fill="#c8cdcb"/><path d="M43 88h154v43q0 10-10 10H53q-10 0-10-10Z" fill="#9da6a5"/><rect x="57" y="96" width="126" height="28" rx="3" fill="#232d30"/><path d="m68 114-11 36h123l-10-36Z" fill="#7b8589"/><rect x="149" y="73" width="27" height="10" rx="2" fill="#485b61"/><circle cx="184" cy="78" r="2" fill="#bc744b"/>';
        if(damage==='paper-jam') shape += '<path d="m65 44 10-25h114l-13 25Z" fill="#3d484c"/><path d="M77 24h107" stroke="#8b979a" stroke-width="3"/><path d="m80 109 6 8-5 13 17-5 10 15 9-17 12 7 4-21Z" fill="#f4f0e4"/><path d="m88 112 9 11 10-8 6 8" fill="none" stroke="#c2bba8"/><path d="M63 100v12m13-12v12m13-12v7m61-7v12m13-12v12m13-12v12" stroke="#bdc5c2" stroke-width="4"/>';
        else shape += '<path d="m67 116-9 33h31l8-33" fill="#3d484c"/><path d="m151 117 11 25 15-9-9-17" fill="#596568"/>';
        break;
      case 'audio':
        shape = '<path d="M69 94V70a51 51 0 0 1 102 0v24" fill="none" stroke="#384348" stroke-width="16"/><path d="M69 75v21m102-21v21" stroke="#9da7a8" stroke-width="5"/><rect x="55" y="85" width="31" height="57" rx="12" fill="#293236"/><rect x="154" y="85" width="31" height="57" rx="12" fill="#293236"/><rect x="78" y="90" width="12" height="47" rx="5" fill="#778185"/><rect x="150" y="90" width="12" height="47" rx="5" fill="#778185"/><path d="m61 119 6-5-3 13 8-5m98-23-5 8 9 3-6 7" fill="none" stroke="#c5b8a3" stroke-width="2"/>';
        break;
      case 'gaming':
        shape = '<rect x="27" y="43" width="186" height="101" rx="23" fill="#8b9b9d"/><rect x="56" y="49" width="128" height="89" rx="5" fill="#1a2327"/>'+screen(62,55,116,77)+'<circle cx="42" cy="73" r="8" fill="#384348"/><path d="M38 98h8v18h-8Zm-5 5h18v8H33Z" fill="#384348"/><circle cx="197" cy="119" r="8" fill="#384348"/><g fill="#384348"><circle cx="196" cy="69" r="3"/><circle cx="205" cy="78" r="3"/><circle cx="187" cy="78" r="3"/><circle cx="196" cy="87" r="3"/></g>';
        break;
      case 'desktops':
        shape = '<rect x="66" y="15" width="109" height="138" rx="5" fill="#8b9698"/><rect x="73" y="23" width="75" height="122" rx="2" fill="#242f33"/><rect x="83" y="36" width="55" height="74" rx="2" fill="#53675b"/><rect x="96" y="49" width="28" height="28" fill="#9ea9a4"/><path d="M89 87h43m-43 8h43m-43 8h43" stroke="#a9b0a4" stroke-width="3"/><path d="m119 115 18 12-9 12m-36-20 8 13-9 8" fill="none" stroke="#ad8868" stroke-width="2"/><circle cx="161" cy="32" r="4" fill="#303c40"/><path d="M155 50h12m-12 6h12m-12 6h12m-12 70h12" stroke="#465358" stroke-width="3"/><path d="m183 68 17 7-8 76-14-8Z" fill="#b7bfbd"/>';
        break;
      case 'cameras':
        shape = '<path d="m89 51 8-17h47l10 17" fill="#374247"/><rect x="44" y="50" width="154" height="90" rx="13" fill="#3c484d"/><rect x="49" y="56" width="31" height="76" rx="8" fill="#283338"/><circle cx="127" cy="94" r="43" fill="#78868b"/><circle cx="127" cy="94" r="35" fill="#1a262c"/><circle cx="127" cy="94" r="25" fill="#41575e"/><circle cx="127" cy="94" r="15" fill="#263840"/><path d="m128 69-6 20 15 8-18 18m3-26-14-6m29 14 14 5" fill="none" stroke="#d8e1df" stroke-width="1.2"/><rect x="162" y="59" width="22" height="9" rx="2" fill="#c5ccca"/>';
        break;
      case 'accessories':
        shape = '<path d="M121 42V25q0-10 17-10h29" fill="none" stroke="#667579" stroke-width="3"/><rect x="20" y="52" width="200" height="87" rx="7" fill="#9ba7a9"/>';
        for(let row=0;row<3;row++) for(let col=0;col<12;col++) {
          const missing = (row===1 && (col===3||col===4)) || (row===0&&col===9);
          shape += '<rect x="'+(29+col*15)+'" y="'+(61+row*17)+'" width="12" height="13" rx="2" fill="'+(missing?'#37484d':'#d7ddda')+'"/>';
          if(missing) shape += '<path d="m'+(33+col*15)+' '+(65+row*17)+'h4v4h-4Z" fill="#b8b5a2"/>';
        }
        shape += '<rect x="76" y="115" width="89" height="13" rx="2" fill="#d7ddda"/>';
        break;
    }
    return '<svg class="device-art" viewBox="0 0 240 170" width="220" height="156" fill="none" aria-hidden="true" focusable="false"><ellipse cx="120" cy="157" rx="82" ry="5" fill="#182f35" opacity=".07"/>'+shape+'</svg>';
  };
})();
