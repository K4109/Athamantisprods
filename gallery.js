/* Lightbox dinâmico: compatível com fotos adicionadas pelo Pages CMS. */
const d=document.querySelector('#lightbox');
let active=0;
const controls=document.createElement('div');
controls.className='lightbox-controls';
controls.innerHTML='<button type="button" aria-label="Fotografia anterior">Anterior</button><span aria-live="polite"></span><button type="button" aria-label="Próxima fotografia">Próxima</button>';
d.append(controls);
const currentItems=()=>[...document.querySelectorAll('.collection button.project[data-image]')];
function show(i){
  const items=currentItems();
  if(!items.length)return;
  active=(i+items.length)%items.length;
  const b=items[active],im=document.querySelector('#lightbox-image');
  im.src=b.dataset.image;
  im.classList.toggle('monochrome-image',b.dataset.tone==='mono');
  im.alt=b.querySelector('img')?.alt||'';
  document.querySelector('#lightbox-caption').textContent=b.dataset.title||'';
  controls.querySelector('span').textContent=(active+1)+' / '+items.length;
}
document.querySelector('.collection').addEventListener('click',e=>{
  const b=e.target.closest('button.project[data-image]');
  if(!b)return;
  const i=currentItems().indexOf(b);
  if(i===-1)return;
  show(i);
  if(!d.open)d.showModal();
  document.body.classList.add('modal-open');
});
controls.firstElementChild.addEventListener('click',()=>show(active-1));
controls.lastElementChild.addEventListener('click',()=>show(active+1));
document.querySelector('#close-lightbox').addEventListener('click',()=>d.close());
d.addEventListener('close',()=>document.body.classList.remove('modal-open'));
d.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft'){e.preventDefault();show(active-1)}
  if(e.key==='ArrowRight'){e.preventDefault();show(active+1)}
});
