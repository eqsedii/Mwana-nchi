(function(){
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const M=window.MW,P=window.PRODUCTS,C=window.CATS;
const fmt=n=>n.toLocaleString('en-KE');
const COUNTIES=["Baringo","Bomet","Bungoma","Busia","Elgeyo-Marakwet","Embu","Garissa","Homa Bay","Isiolo","Kajiado","Kakamega","Kericho","Kiambu","Kilifi","Kirinyaga","Kisii","Kisumu","Kitui","Kwale","Laikipia","Lamu","Machakos","Makueni","Mandera","Marsabit","Meru","Migori","Mombasa","Murang'a","Nairobi","Nakuru","Nandi","Narok","Nyamira","Nyandarua","Nyeri","Samburu","Siaya","Taita-Taveta","Tana River","Tharaka-Nithi","Trans Nzoia","Turkana","Uasin Gishu","Vihiga","Wajir","West Pokot"];
const page=document.body.dataset.page;
/* ---- cart ---- */
let cart=[];try{cart=JSON.parse(localStorage.getItem('mwcart')||'[]')}catch(e){}
const save=()=>{try{localStorage.setItem('mwcart',JSON.stringify(cart))}catch(e){}};
const prod=id=>P.find(p=>p.id===id);
const img=(p,i=0)=>p.img.length?`images/p/${p.img[i]}.jpg`:'images/logo.jpg';
const count=()=>cart.reduce((a,c)=>a+c.q,0);
function totals(){let t=0,quotes=0;cart.forEach(c=>{const p=prod(c.id),v=p.v[c.vi];if(v.p==null)quotes++;else t+=v.p*c.q});return{t,quotes}}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('show'),2200)}
function addCart(id,vi,q=1){q=Math.max(1,q|0);const f=cart.find(c=>c.id===id&&c.vi===vi);f?f.q+=q:cart.push({id,vi,q});save();renderCart();toast('Added to cart ✓')}
/* ---- shell ---- */
const nav=[['index.html','Home','home'],['products.html','Products','products'],['about.html','About','about'],['contact.html','Contact','contact']];
document.body.insertAdjacentHTML('afterbegin',`<div id="pl"><div class="pl-in"><img src="images/logo.jpg" alt=""></div></div>
<header><div class="wrap nav"><a class="brand" href="index.html"><img src="images/logo.jpg" alt="Mwananchi logo"><span>MWANANCHI<small>SUPPLIES LIMITED</small></span></a>
<nav class="menu" id="menu">${nav.map(n=>`<a href="${n[0]}" class="${page===n[2]?'on':''}">${n[1]}</a>`).join('')}</nav>
<div class="hr"><button class="btn cartbtn sm" data-act="cart" aria-label="Cart">🛒 <b id="cc">0</b></button><button class="burger" id="bg" aria-label="Menu">☰</button></div></div></header>`);
document.body.insertAdjacentHTML('beforeend',`
<footer><div class="wrap"><div class="fg"><div><h4>Mwananchi Supplies Limited</h4><p>Build Better. Live Better.<br>Your trusted construction partner – quality materials, fair prices, reliable delivery countrywide.</p></div>
<div><h4>Quick Links</h4>${nav.map(n=>`<a href="${n[0]}">${n[1]}</a>`).join('')}<a href="checkout.html">Checkout</a></div>
<div><h4>Categories</h4>${C.slice(0,6).map(c=>`<a href="products.html?cat=${c.id}">${c.n}</a>`).join('')}</div>
<div><h4>Contact</h4><a href="https://wa.me/${M.whatsapp}" target="_blank">💬 WhatsApp: ${M.phoneDisplay}</a><a href="mailto:${M.email}">✉️ ${M.email}</a><a>📍 ${M.address}</a><a>🕒 ${M.hours}</a></div></div>
<div class="cp">© ${new Date().getFullYear()} Mwananchi Supplies Limited. All rights reserved. Prices are indicative – confirmed on WhatsApp.</div></div></footer>
<div class="ov" id="ov"></div>
<aside class="dr" id="dr"><h3>Your Cart <button id="dx">✕</button></h3><div class="bd" id="db"></div><div class="ft" id="df"></div></aside>
<div class="md" id="md"></div><div id="toast"></div>
<div class="fab"><button id="up">↑</button><a href="https://wa.me/${M.whatsapp}?text=${encodeURIComponent('Hello Mwananchi Supplies, I need help with...')}" target="_blank" aria-label="WhatsApp">💬</a></div>
<div class="sp" id="sp"></div>`);
/* page loader */
window.addEventListener('load',()=>setTimeout(()=>$('#pl').classList.add('hide'),450));setTimeout(()=>$('#pl').classList.add('hide'),3000);
$('#bg').onclick=()=>$('#menu').classList.toggle('open');
/* ---- logo loader on every button ---- */
function prep(b){if(!$('.ld',b)){b.insertAdjacentHTML('afterbegin','<span class="ld"><img src="images/logo.jpg" alt=""></span>')}}
const A={
 add(b){const c=b.closest('.pc,.md'),s=$('select',c),n=$('.qn',c);addCart(b.dataset.id,s?+s.value:0,n?+n.value:1)},
 view(b){openQV(b.dataset.id)},
 cart(){openDr(true)},
 go(b){location.href=b.dataset.href},
 inc(b){const c=cart[+b.dataset.i];c.q++;save();renderCart()},
 dec(b){const c=cart[+b.dataset.i];c.q--;if(c.q<1)cart.splice(+b.dataset.i,1);save();renderCart()},
 del(b){cart.splice(+b.dataset.i,1);save();renderCart()},
 search(){const q=$('#hq').value.trim();location.href='products.html'+(q?'?q='+encodeURIComponent(q):'')},
 submit(b){submitOrder()}
};
document.addEventListener('click',e=>{
 const b=e.target.closest('.btn');if(!b)return;
 const act=b.dataset.act;prep(b);
 if(act){e.preventDefault();if(b.classList.contains('loading'))return;b.classList.add('loading');
  const quick=['inc','dec','del','add'].includes(act);
  setTimeout(()=>{b.classList.remove('loading');try{A[act](b)}catch(x){console.error(x)}},quick?450:650);return}
 if(b.tagName==='A'){const h=b.getAttribute('href')||'';b.classList.add('loading');
  if(b.target==='_blank'||/^(tel|mailto|#)/.test(h)){setTimeout(()=>b.classList.remove('loading'),1200);return}
  e.preventDefault();setTimeout(()=>location.href=h,550)}
});
/* ---- drawer / modal ---- */
function openDr(o){$('#dr').classList.toggle('show',o);$('#ov').classList.toggle('show',o)}
$('#dx').onclick=()=>openDr(false);
$('#ov').onclick=()=>{openDr(false);$('#md').classList.remove('show');$('#ov').classList.remove('show')};
function pricetxt(p,vi){const v=p.v[vi];return v.p==null?'<span class="pr">Request quote</span>':`<span class="pr">${M.currency} ${fmt(v.p)} <small>${p.u}</small></span>`}
const unit=p=>p.v.length>1?p.u.replace(/\s*\(from\)/,''):p.u;
function priceBox(p,vi,q){const v=p.v[vi];if(v.p==null)return `<span class="pr">Request quote</span>`;
 return `<span class="pr" data-pr>${M.currency} ${fmt(v.p*q)} <small>${q>1?'for '+q+' · '+M.currency+' '+fmt(v.p)+' each':unit(p)}</small></span>`}
function qtyBox(){return `<div class="qs"><button type="button" data-qd aria-label="Less">−</button><input class="qn" type="number" min="1" max="9999" value="1" inputmode="numeric" aria-label="Quantity"><button type="button" data-qu aria-label="More">+</button></div>`}
function cardHTML(p){const multi=p.v.length>1;
 return `<article class="pc rv" data-pid="${p.id}"><div class="im" data-act-v="${p.id}">${p.hot?'<span class="tag">POPULAR</span>':''}<img loading="lazy" class="${p.img.length?'':'logo'}" src="${img(p)}" alt="${p.n}"></div>
 <div class="pb"><h3>${p.n}</h3>${multi?`<select class="pv" aria-label="Size / option">${p.v.map((v,i)=>`<option value="${i}">${v.l}</option>`).join('')}</select>`:''}
 <div class="pw">${priceBox(p,0,1)}</div>${qtyBox()}
 <button class="btn sm ghost" data-act="view" data-id="${p.id}">Details</button><button class="btn sm" data-act="add" data-id="${p.id}">🛒 Add to Cart</button></div></article>`}
/* live price: size / quantity change updates the price */
function refreshPrice(c){const p=prod(c.dataset.pid||c.querySelector('[data-act=add]').dataset.id),s=$('select',c),n=$('.qn',c),w=$('.pw',c);if(!w)return;
 const q=Math.max(1,Math.min(9999,parseInt(n.value)||1));w.innerHTML=priceBox(p,s?+s.value:0,q)}
document.addEventListener('input',e=>{const c=e.target.closest('.pc,.md');if(c&&e.target.matches('select,.qn'))refreshPrice(c)});
document.addEventListener('change',e=>{const c=e.target.closest('.pc,.md');if(c&&e.target.matches('.qn')){e.target.value=Math.max(1,Math.min(9999,parseInt(e.target.value)||1));refreshPrice(c)}});
document.addEventListener('click',e=>{const d=e.target.closest('[data-qd],[data-qu]');if(!d)return;const c=d.closest('.pc,.md'),n=$('.qn',c);n.value=Math.max(1,Math.min(9999,(parseInt(n.value)||1)+(d.matches('[data-qd]')?-1:1)));refreshPrice(c)});
function openQV(id){const p=prod(id),m=$('#md');
 m.innerHTML=`<button class="mx" id="mx">✕</button><div class="mg"><div><img class="main" id="mi" src="${img(p)}" alt="${p.n}"><div class="th">${p.img.map((n,i)=>`<img src="images/p/${n}.jpg" class="${i?'':'on'}" data-t="${i}" alt="">`).join('')}</div></div>
 <div style="display:flex;flex-direction:column;gap:10px"><h2 style="color:var(--navy)">${p.n}</h2><p style="color:var(--mut)">${p.d}</p>
 ${p.v.length>1?`<select class="pv" style="padding:11px;border-radius:10px;border:1.5px solid #d5dcee" id="mv">${p.v.map((v,i)=>`<option value="${i}">${v.l}</option>`).join('')}</select>`:''}<div class="pw">${priceBox(p,0,1)}</div>${qtyBox()}
 <button class="btn" data-act="add" data-id="${p.id}">🛒 Add to Cart</button>
 <a class="btn wa" target="_blank" href="https://wa.me/${M.whatsapp}?text=${encodeURIComponent('Hello Mwananchi Supplies, I am interested in: '+p.n)}">💬 Ask on WhatsApp</a>
 <p class="note">Prices are indicative and confirmed on WhatsApp before payment. Product photos may be illustrative.</p></div></div>`;
 m.classList.add('show');$('#ov').classList.add('show');
 $('#mx').onclick=()=>{m.classList.remove('show');$('#ov').classList.remove('show')};
 $$('.th img',m).forEach(t=>t.onclick=()=>{$('#mi').src=t.src;$$('.th img',m).forEach(x=>x.classList.remove('on'));t.classList.add('on')})}
document.addEventListener('click',e=>{const v=e.target.closest('[data-act-v]');if(v)openQV(v.dataset.actV)});
/* ---- cart render ---- */
function lines(){return cart.map((c,i)=>{const p=prod(c.id),v=p.v[c.vi];return `<div class="ci"><img src="${img(p)}" alt=""><div class="t">${p.n}<small>${p.v.length>1?v.l+' · ':''}${v.p==null?'Quote':M.currency+' '+fmt(v.p)}</small></div><div class="q"><button class="btn" style="padding:0;width:28px;height:28px;background:#e8edf7;color:var(--navy);box-shadow:none" data-act="dec" data-i="${i}">−</button><b>${c.q}</b><button class="btn" style="padding:0;width:28px;height:28px;background:#e8edf7;color:var(--navy);box-shadow:none" data-act="inc" data-i="${i}">+</button></div><button class="btn x" style="background:none;box-shadow:none;padding:4px;color:#d62828" data-act="del" data-i="${i}">🗑</button></div>`}).join('')}
function totHTML(){const{t,quotes}=totals();return `<div class="tot"><span>Total</span><span>${M.currency} ${fmt(t)}</span></div>${quotes?`<p class="note">+ ${quotes} item(s) on quote – price confirmed on WhatsApp.</p>`:''}`}
function renderCart(){$('#cc').textContent=count();
 $('#db').innerHTML=cart.length?lines():'<div class="empty">🛒<br>Your cart is empty.</div>';
 $('#df').innerHTML=cart.length?totHTML()+`<button class="btn block" style="margin-top:10px" data-act="go" data-href="checkout.html">Checkout →</button>`:'';
 const cl=$('#colines');if(cl){cl.innerHTML=cart.length?lines():'<div class="empty">Your cart is empty.<br><br><a class="btn" href="products.html">Browse products</a></div>';$('#cotot').innerHTML=cart.length?totHTML():''}}
/* ---- page specific ---- */
function reveal(){const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.1});$$('.rv:not(.in)').forEach(el=>io.observe(el))}
if($('#feat')){$('#feat').innerHTML=P.filter(p=>p.hot).slice(0,8).map(cardHTML).join('')}
if($('#catgrid')){$('#catgrid').innerHTML=C.map(c=>`<a class="cat rv" href="products.html?cat=${c.id}"><i>${c.i}</i>${c.n}</a>`).join('')}
if($('#plist')){const u=new URLSearchParams(location.search);let cat=u.get('cat')||'all',q=(u.get('q')||'').toLowerCase();
 $('#tools').innerHTML=`<button class="chip" data-c="all">All</button>`+C.map(c=>`<button class="chip" data-c="${c.id}">${c.i} ${c.n}</button>`).join('');
 const draw=()=>{$$('.chip').forEach(x=>x.classList.toggle('on',x.dataset.c===cat));const l=P.filter(p=>(cat==='all'||p.c===cat)&&(!q||(p.n+p.d).toLowerCase().includes(q)));
  $('#plist').innerHTML=l.length?l.map(cardHTML).join(''):'<div class="empty" style="grid-column:1/-1">No products found. <a href="https://wa.me/'+M.whatsapp+'" target="_blank" style="color:var(--or);font-weight:700">Ask us on WhatsApp</a></div>';reveal()};
 $$('.chip').forEach(x=>x.onclick=()=>{cat=x.dataset.c;draw()});
 const si=$('#sq');if(si){si.value=u.get('q')||'';si.oninput=()=>{q=si.value.toLowerCase();draw()}}draw()}
/* checkout */
if($('#county')){$('#county').innerHTML='<option value="">Select county…</option>'+COUNTIES.map(c=>`<option>${c}</option>`).join('')}
function submitOrder(){
 const f={n:$('#fn'),p:$('#fp'),c:$('#county'),l:$('#fl')};let ok=true;
 const chk=(el,t)=>{el.classList.toggle('bad',!t);if(!t)ok=false};
 chk(f.n,f.n.value.trim().length>=3);chk(f.p,/^(\+?254|0)?[17]\d{8}$/.test(f.p.value.replace(/[\s-]/g,'')));chk(f.c,!!f.c.value);chk(f.l,f.l.value.trim().length>=3);
 if(!cart.length){toast('Your cart is empty');return}
 if(!ok){toast('Please fix the highlighted fields');return}
 const{t,quotes}=totals();
 let m=`*NEW ORDER – Mwananchi Supplies Limited*\n\n*Name:* ${f.n.value.trim()}\n*Phone:* ${f.p.value.trim()}\n*County:* ${f.c.value}\n*Location:* ${f.l.value.trim()}\n\n*Items:*\n`;
 cart.forEach((c,i)=>{const p=prod(c.id),v=p.v[c.vi];m+=`${i+1}. ${p.n}${p.v.length>1?' ('+v.l+')':''} x${c.q} – ${v.p==null?'Quote':M.currency+' '+fmt(v.p*c.q)}\n`});
 m+=`\n*Total:* ${M.currency} ${fmt(t)}${quotes?` (+ ${quotes} item(s) on quote)`:''}`;
 const nt=$('#fnote').value.trim();if(nt)m+=`\n*Notes:* ${nt}`;
 m+='\n\nPlease confirm availability, final price & delivery.';
 const url=`https://wa.me/${M.whatsapp}?text=${encodeURIComponent(m)}`;
 $('#cobox').innerHTML=`<div class="box" style="text-align:center"><h2 style="color:var(--navy)">✅ Almost done!</h2><p style="margin:10px 0">Your order is ready. Send it on WhatsApp to confirm.</p><a class="btn wa" href="${url}" target="_blank">💬 Open WhatsApp</a></div>`;
 cart=[];save();renderCart();location.href=url}
/* hero: embers + gentle pointer parallax */
(function(){const h=$('#hero');if(!h)return;const e=$('.embers',h);
 for(let i=0;i<22;i++){const d=document.createElement('i');d.style.left=Math.random()*100+'%';d.style.setProperty('--dx',(Math.random()*80-40)+'px');d.style.animationDuration=(5+Math.random()*7)+'s';d.style.animationDelay=(Math.random()*8)+'s';d.style.transform='scale('+(.6+Math.random()*1.4)+')';e.appendChild(d)}
 const m=$('img.main',h);h.addEventListener('pointermove',ev=>{const r=h.getBoundingClientRect(),x=(ev.clientX-r.left)/r.width-.5,y=(ev.clientY-r.top)/r.height-.5;h.style.setProperty('--px',x*-14+'px');h.style.setProperty('--py',y*-8+'px');$$('.hv',h).forEach(v=>v.style.translate=(x*16)+'px '+(y*10)+'px')});
 $$('video',h).forEach(v=>{const p=v.play();p&&p.catch(()=>{})})})();
/* counters */
$$('[data-n]').forEach(el=>{const n=+el.dataset.n,io=new IntersectionObserver(es=>{if(es[0].isIntersecting){io.disconnect();let s=null;const st=t=>{s=s||t;const k=Math.min((t-s)/1400,1);el.textContent=Math.floor(n*k).toLocaleString()+(el.dataset.s||'');k<1&&requestAnimationFrame(st)};requestAnimationFrame(st)}});io.observe(el)});
/* back to top */
addEventListener('scroll',()=>$('#up').classList.toggle('show',scrollY>500),{passive:true});$('#up').onclick=()=>scrollTo({top:0,behavior:'smooth'});
/* social proof popups */
(function(){const N=window.MW_NAMES||[];if(!N.length)return;const sp=$('#sp');let last=-1;
 const show=()=>{let i;do{i=Math.floor(Math.random()*N.length)}while(i===last);last=i;const order=Math.random()<.5;
  sp.className='sp '+(Math.random()<.5?'l':'r')+(order?' o':'');
  sp.innerHTML=`<img src="images/logo.jpg" alt=""><div><b>${N[i]}</b><em>${order?'MADE AN ORDER':'MADE A DELIVERY REQUEST'}</em><br><small>Just now · Mwananchi Supplies</small></div>`;
  requestAnimationFrame(()=>requestAnimationFrame(()=>sp.classList.add('show')));
  setTimeout(()=>sp.classList.remove('show'),5000);setTimeout(show,5000+7000+Math.random()*13000)};
 setTimeout(show,6000+Math.random()*4000)})();
renderCart();reveal();
})();
