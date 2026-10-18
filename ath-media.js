/* Conteúdo visual editável; conserva classes, ordem e estilos existentes. */
(()=>{'use strict';
const imagePath=v=>typeof v==='string' && /^\/?assets\/[\w.\-/]+\.(png|jpe?g|webp|avif|gif|svg)$/i.test(v.trim()) && !v.includes('..')?v.trim():'';
const json=async path=>{const r=await fetch(path,{cache:'no-store'});if(!r.ok)throw Error(r.status);return r.json()};
function setImage(el,value,position){if(!el)return;const path=imagePath(value);if(!path)return;el.addEventListener('error',()=>{el.style.visibility='hidden'},{once:true});el.addEventListener('load',()=>{el.style.visibility=''}, {once:true});el.setAttribute(el.tagName.toLowerCase()==='image'?'href':'src',path);if(['top','center','bottom'].includes(position))el.style.objectPosition=position;}
// Missing old demo files must not leave broken-image icons visible.
document.querySelectorAll('.ath-specialty img,.ath-case-card img').forEach(img=>{img.addEventListener('error',()=>{img.style.visibility='hidden'});});
if(location.protocol==='file:')return;
json('data/ath-covers.json').then(d=>{for(const key of ['fotografia','audiovisual','design','websites'])setImage(document.querySelector(`[data-portfolio-tab="${key}"] img`),d[key]?.image,d[key]?.position);}).catch(console.warn);
json('data/ath-home-images.json').then(d=>{
 ['opening_1','opening_2','opening_3'].forEach((k,i)=>setImage(document.querySelectorAll('.triptych img')[i],d[k]));
 ['social_1','social_2','social_3'].forEach((k,i)=>setImage(document.querySelectorAll('.social-photos img')[i],d[k]));
 document.querySelectorAll('.hero-logo image,.about-logo image,.footer-logo image').forEach(el=>setImage(el,d.logo));
}).catch(console.warn);
const make=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n};
function videoInfo(value){try{const u=new URL(value);if(u.protocol!=='https:')return null;let id;if(['vimeo.com','www.vimeo.com'].includes(u.hostname)&&/^\/\d+\/?$/.test(u.pathname)){id=u.pathname.split('/')[1];return {embed:'https://player.vimeo.com/video/'+id,link:u.href,provider:'Vimeo'}}if(['youtube.com','www.youtube.com','youtu.be'].includes(u.hostname)){id=u.hostname==='youtu.be'?u.pathname.slice(1):u.searchParams.get('v')||u.pathname.split('/shorts/')[1];if(/^[\w-]{11}$/.test(id||''))return {embed:'https://www.youtube-nocookie.com/embed/'+id,link:u.href,provider:'YouTube'}}return null}catch{return null}}
json('data/ath-videos.json').then(d=>{
 const panel=document.querySelector('#portfolio-audiovisual'),grid=panel?.querySelector('.film-grid');if(!grid||!Array.isArray(d.videos))return;
 const h=panel.querySelector('h3');if(typeof d.title==='string'){h.replaceChildren(document.createTextNode(d.title+' '),make('em','',d.accent||''));}
 if(typeof d.description==='string')panel.querySelector('.ath-panel-head p').textContent=d.description;
 const fragment=document.createDocumentFragment();
 for(const item of d.videos){const video=videoInfo(item.url);if(item.visible===false||!video||!imagePath(item.image))continue;
 const article=make('article'),b=make('button','film');b.type='button';b.dataset.videoEmbed=video.embed;b.setAttribute('aria-label','Reproduzir '+item.title);
 const img=make('img');img.alt=item.title||'Capa do vídeo';img.loading='lazy';setImage(img,item.image);b.append(img,make('span','play','▶'));
 const link=make('a','text-link','Assistir no '+video.provider+' ↗');link.href=video.link;link.target='_blank';link.rel='noopener noreferrer';article.append(b,make('p','',item.title||'Vídeo'),link);fragment.append(article);
 }grid.replaceChildren(fragment);
}).catch(console.warn);
document.querySelector('#videos')?.addEventListener('click',event=>{const b=event.target.closest('[data-video-embed]');if(!b)return;const dialog=document.querySelector('#video-dialog');const f=make('iframe');f.src=b.dataset.videoEmbed+'?autoplay=1';f.title=b.getAttribute('aria-label');f.allow='autoplay; fullscreen; picture-in-picture';f.allowFullscreen=true;document.querySelector('#video-player').replaceChildren(f);dialog.showModal();document.body.classList.add('modal-open');});
})();
