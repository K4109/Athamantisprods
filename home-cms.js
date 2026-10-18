/* Athamantis — fotos editáveis da página inicial via data/home.json */
(() => {
  'use strict';
  const section = document.querySelector('section[data-cms-home]');
  const gallery = section && section.querySelector('.gallery');
  if (!gallery) return;
  const lightbox = document.querySelector('#lightbox');
  // Funciona com novos botões adicionados ao DOM depois do carregamento da página.
  gallery.addEventListener('click', event => {
    const b = event.target.closest('button.project[data-image]');
    if (!b || !gallery.contains(b) || !lightbox) return;
    const img = document.querySelector('#lightbox-image');
    img.src = b.dataset.image;
    img.alt = b.querySelector('img')?.alt || '';
    img.classList.toggle('monochrome-image', b.dataset.tone === 'mono');
    document.querySelector('#lightbox-caption').textContent = b.dataset.title || '';
    if (!lightbox.open) lightbox.showModal();
    document.body.classList.add('modal-open');
  });
  if (!window.fetch || location.protocol === 'file:') return;
  const assetsPath = value => {
    if (typeof value !== 'string') return '';
    const p = value.trim();
    return (p.startsWith('assets/') || p.startsWith('/assets/')) && !p.includes('..') && !p.includes('\\') && !p.includes('?') && !p.includes('#') ? p : '';
  };
  fetch('data/home.json', { cache: 'no-store' })
    .then(res => { if (!res.ok) throw new Error(`HTTP ${res.status}`); return res.json(); })
    .then(data => {
      if (!Array.isArray(data.photos)) return;
      const template = gallery.querySelector('button.project');
      if (!template) return;
      const fragment = document.createDocumentFragment();
      data.photos.slice(0, Number.isInteger(data.photo_limit) && data.photo_limit >= 0 ? (data.photo_limit || data.photos.length) : 6).forEach(photo => {
        if (!photo || !assetsPath(photo.image)) return;
        const b = template.cloneNode(true);
        const title = String(photo.title || 'Fotografia');
        b.className = `project${photo.tall ? ' tall' : ''}${photo.monochrome ? ' monochrome' : ''}`;
        b.dataset.category = String(photo.category || 'ensaios');
        b.dataset.title = title;
        b.dataset.image = assetsPath(photo.image);
        if (photo.monochrome) b.dataset.tone = 'mono'; else delete b.dataset.tone;
        b.setAttribute('aria-label', `Ampliar ${title}`);
        const img = b.querySelector('img');
        img.src = assetsPath(photo.thumbnail) || assetsPath(photo.image);
        img.alt = photo.alt || `${title} — fotografia de Kaio Mendes`;
        img.loading = 'lazy';
        img.decoding = 'async';
        b.querySelector('b').textContent = title;
        b.querySelector('small').textContent = String(photo.subtitle || 'ATHAMANTIS');
        fragment.append(b);
      });
      gallery.replaceChildren(fragment);
      // Mantém o filtro selecionado mesmo que a edição carregue depois do clique.
      const active = section.querySelector('[data-filter].active');
      if (active && active.dataset.filter !== 'all') {
        gallery.querySelectorAll('button.project').forEach(b => { b.hidden = b.dataset.category !== active.dataset.filter; });
      }
    })
    .catch(err => console.warn('Athamantis: fotos da home indisponíveis; usando HTML original.', err));
})();

