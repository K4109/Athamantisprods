/* Athamantis — navegação da vitrine e projetos criativos; mantém galerias e CMS originais */
(()=>{
'use strict';
const controls=[...document.querySelectorAll('[data-portfolio-tab]')];
const panels=[...document.querySelectorAll('[data-portfolio-panel]')];
function choose(category,scroll){
 const found=controls.some(c=>c.dataset.portfolioTab===category);
 if(!found)return;
 controls.forEach(c=>{const on=c.dataset.portfolioTab===category;c.classList.toggle('is-active',on);c.setAttribute('aria-pressed',String(on));});
 panels.forEach(p=>p.hidden=p.dataset.portfolioPanel!==category);
 if(scroll)document.querySelector('#ath-explorar')?.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
}
controls.forEach(b=>b.addEventListener('click',()=>choose(b.dataset.portfolioTab,true)));
for(const a of document.querySelectorAll('a[data-open-portfolio]'))a.addEventListener('click',e=>{e.preventDefault();choose(a.dataset.openPortfolio,true)});
const hash=location.hash.slice(1);
if(hash.startsWith('portfolio-'))choose(hash.replace('portfolio-',''),false);
const grids={design:document.querySelector('[data-projects="design"]'),websites:document.querySelector('[data-projects="websites"]')};
function imagePath(v){const s=String(v||'');return /^(?:\/?assets\/)[\w.\-/]+\.(?:png|jpg|jpeg|webp|avif|svg)$/i.test(s)&&!s.includes('..')?s:''}
function safeLink(value){if(typeof value!=='string'||!value.trim())return '';try{const u=new URL(value,location.href);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
function render(data, onlyCategory){if(!Array.isArray(data?.projects))return;
 for(const category of Object.keys(grids)){
 if(onlyCategory && category!==onlyCategory)continue;
 const panel=document.querySelector('#portfolio-'+category);
 if(typeof data.title==='string'){const em=document.createElement('em');em.textContent=data.accent||'';panel.querySelector('h3').replaceChildren(document.createTextNode(data.title+' '),em);}
 if(typeof data.description==='string')panel.querySelector('.ath-panel-head p').textContent=data.description;
 const grid=grids[category];if(!grid)continue;
 const items=data.projects.filter(p=>p && (onlyCategory || p.category===category) && p.visible!==false && p.featured!==false && p.title && imagePath(p.image));
 if(!items.length){grid.textContent='Novos projetos serão apresentados em breve.';continue}
 grid.replaceChildren();
 for(const item of items){
   const article=document.createElement('article');article.className='ath-case-card';
   const figure=document.createElement('figure');const img=document.createElement('img');img.src=imagePath(item.image);img.alt=item.alt||item.title;img.addEventListener('error',()=>{img.style.visibility='hidden'});img.loading='lazy';figure.append(img);
   const block=document.createElement('div');block.className='ath-case-content';
   const label=document.createElement('small');label.textContent=item.type||'PROJETO';
   const heading=document.createElement('h4');heading.textContent=item.title;
   const description=document.createElement('p');description.textContent=item.description||'';
   block.append(label,heading,description);
   const link=safeLink(item.link);if(link){const a=document.createElement('a');a.href=link;a.target='_blank';a.rel='noopener noreferrer';a.textContent='VISITAR PROJETO ↗';block.append(a)}
   article.append(figure,block);grid.append(article);
 }
 }
}
// Fallback real no HTML permite abrir o ZIP com dois cliques. No Cloudflare, dados do CMS prevalecem.
if(location.protocol!=='file:')for(const category of Object.keys(grids)){fetch('data/ath-'+category+'.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('HTTP '+r.status);return r.json()}).then(data=>render(data,category)).catch(e=>console.info('Usando projetos do HTML:',e.message));}
})();
