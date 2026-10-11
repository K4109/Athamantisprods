/* Athamantis — galerias editáveis com Pages CMS.
 * Conteúdo: data/<pagina>.json. O HTML original fica como prévia/fallback.
 */
(() => {
  'use strict';
  const main = document.querySelector('main[data-cms-gallery]');
  if (!main || !window.fetch || location.protocol === 'file:') return;
  const slug = main.dataset.cmsGallery;
  if (!/^[a-z-]+$/.test(slug)) return;

  const assetsPath = value => {
    if (typeof value !== 'string') return '';
    const p = value.trim();
    if (!(p.startsWith('assets/') || p.startsWith('/assets/')) || p.includes('..') || p.includes('\\') || p.includes('?') || p.includes('#')) return '';
    return p;
  };
  const setText = (el, value) => { el.textContent = typeof value === 'string' ? value : ''; };
  const make = (tag, css, text) => {
    const n = document.createElement(tag);
    if (css) n.className = css;
    if (text !== undefined) setText(n, text);
    return n;
  };
  const makeCard = (photo, fallbackSubtitle, baseTemplate) => {
    const image = assetsPath(photo.image);
    if (!image) return null;
    const title = String(photo.title || 'Fotografia');
    // Clone do botão já presente no site preserva o ícone SVG, o HTML e o estilo original.
    const b = baseTemplate.cloneNode(true);
    b.className = 'project' + (photo.monochrome ? ' monochrome' : '');
    b.dataset.category = slug;
    b.dataset.image = image;
    b.dataset.title = title;
    if (photo.monochrome) b.dataset.tone = 'mono';
    else delete b.dataset.tone;
    b.setAttribute('aria-label', `Ampliar ${title}`);
    const img = b.querySelector('img');
    img.src = assetsPath(photo.thumbnail) || image;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.alt = photo.alt || `${title} — fotografia de Kaio Mendes`;
    setText(b.querySelector('b'), title);
    setText(b.querySelector('small'), photo.subtitle || fallbackSubtitle);
    return b;
  };
  const render = data => {
    if (!Array.isArray(data.series)) return;
    const oldSections = [...main.querySelectorAll('section.photo-series')];
    const nav = main.querySelector('nav.series-nav');
    if (!oldSections.length || !nav) return;
    const btnTemplate = oldSections[0].querySelector('button.project');
    if (!btnTemplate) return;
    const sections = document.createDocumentFragment();
    const links = document.createDocumentFragment();
    const taken = new Set();
    data.series.forEach((entry, index) => {
      if (!entry || typeof entry !== 'object') return;
      const photos = Array.isArray(entry.photos) ? entry.photos : [];
      const baseId = typeof entry.id === 'string' && /^[a-z0-9_-]+$/i.test(entry.id) ? entry.id : `serie-cms-${index}`;
      let id = baseId, suffix = 2;
      while (taken.has(id)) id = `${baseId}-${suffix++}`;
      taken.add(id);
      const title = String(entry.title || `Série ${index + 1}`);
      const section = make('section', 'photo-series');
      section.id = id;
      const heading = make('div', 'series-heading');
      let eyebrow = String(entry.eyebrow || '');
      eyebrow = eyebrow.replace(/^\d+\s+FOTOGRAFIAS\b/, `${String(photos.length).padStart(2, '0')} FOTOGRAFIAS`);
      if (eyebrow) heading.append(make('span', 'eyebrow', eyebrow));
      heading.append(make('h2', null, title));
      if (entry.description) heading.append(make('p', null, String(entry.description)));
      section.append(heading);
      const gallery = make('div', 'gallery');
      photos.forEach(photo => {
        if (!photo || typeof photo !== 'object') return;
        const card = makeCard(photo, slug.toUpperCase(), btnTemplate);
        if (card) gallery.append(card);
      });
      section.append(gallery);
      sections.append(section);
      const link = make('a', null, title);
      link.href = `#${id}`;
      links.append(link);
    });
    oldSections[0].before(sections);
    oldSections.forEach(section => section.remove());
    nav.replaceChildren(links);
  };
  fetch(`data/${slug}.json`, { cache: 'no-store' })
    .then(response => { if (!response.ok) throw new Error(`HTTP ${response.status}`); return response.json(); })
    .then(render)
    .catch(err => console.warn('Athamantis: galeria JSON indisponível; usando HTML original.', err));
})();
