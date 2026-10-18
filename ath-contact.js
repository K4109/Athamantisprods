/* Um único cadastro de contato para todas as páginas. */
(()=>{'use strict';
if(location.protocol==='file:')return;
const greeting='Olá! Vim pelo site da Athamantis e gostaria de conversar sobre uma ideia de projeto 😊';
fetch('data/ath-settings.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(d=>{
 const phone=String(d.whatsapp||'').replace(/\D/g,'');window.athContactSettings=d;
 const url=value=>{if(!value||!String(value).trim())return '';try{const u=new URL(value);return u.protocol==='https:'?u.href:''}catch{return ''}};
 for(const a of document.querySelectorAll('a[href]')){
  const h=a.getAttribute('href');
  if(/^https:\/\/wa.me\//.test(h)&&/^\d{10,15}$/.test(phone))a.href='https://wa.me/'+phone+'?text='+encodeURIComponent(greeting);
  for(const [pattern,key] of [[/instagram\.com\/atamantisprods/i,'instagram'],[/instagram\.com\/kaiosmendes/i,'personal_instagram'],[/facebook\.com\/Athamantisprods/i,'facebook']])if(pattern.test(h)&&url(d[key]))a.href=url(d[key]);
  if(h.startsWith('mailto:')&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email||'')){a.href='mailto:'+d.email;for(const n of a.childNodes)if(n.nodeType===3&&n.textContent.includes('@'))n.textContent=d.email+' ';}
 }
}).catch(e=>console.info('Contato original preservado:',e.message));
})();
