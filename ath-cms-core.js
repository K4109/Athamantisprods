/* ATHAMANTIS / CMS CORE v1
   Camada aditiva: nao altera arquivos data/*.json existentes de galerias nem HTML original.
   Quando os dados novos nao carregam, mantem o site atual (fallback). */
(() => {
  'use strict';
  const $ = (q, root=document) => root.querySelector(q);
  const make = (tag, cls, text) => {
    const el=document.createElement(tag);
    if(cls) el.className=cls;
    if(text!==undefined && text!==null) el.textContent=String(text);
    return el;
  };
  const imgSrc = (input) => {
    const value=String(input || '').trim();
    if(!value || /^\s*(?:javascript|data|blob):/i.test(value)) return '';
    if(value.startsWith('/') && !value.startsWith('//')) return value;
    if(/^https:\/\//i.test(value)) return value;
    return (/^(?:\.\/)?[a-zA-Z0-9][^?#]*\.(?:png|jpe?g|webp|avif|gif)(?:[?#].*)?$/i.test(value) && !value.includes('..')) ? value : '';
  };
  const safeUrl = (input) => {
    try { const u=new URL(String(input||''), location.href);return ['http:','https:'].includes(u.protocol) ? u.href : ''; }
    catch{return '';}
  };
  const getJson=async(path)=>{
    try { const r=await fetch(path,{cache:'no-store'});if(!r.ok) throw Error('HTTP '+r.status);return await r.json(); }
    catch(err){console.info('[ATH CMS] Dados não carregados:',path,err.message);return null;}
  };
  const setText=(selector,value,lines=false)=>{
    const el=$(selector);if(!el || typeof value!=='string')return;
    el.textContent=value;if(lines)el.style.whiteSpace='pre-line';
  };
  const setHeadline=(selector,part1,part2,outline=false)=>{
    const root=$(selector);if(!root || !part1 || !part2)return;
    const br=make('br');const accent=make('span',outline?'outline':'muted',part2);
    root.replaceChildren(document.createTextNode(part1),br,accent);
  };
  function applyHome(d) {
    if(!d || typeof d!=='object')return;
    setText('#inicio .hero-meta span:first-child', d.hero_kicker_left);
    setText('#inicio .hero-meta span:last-child', d.hero_kicker_right);
    if(d.hero_line1 && d.hero_line2 && d.hero_outline){
      const el=$('#inicio .hero-title h1'); if(el){const accent=make('span','outline',' '+d.hero_outline);el.replaceChildren(document.createTextNode(d.hero_line1),make('br'),document.createTextNode(d.hero_line2),accent);}
    }
    setText('#inicio .hero-bottom p',d.hero_description,true);
    setText('#trabalhos .section-top p',d.work_intro,true);
    setHeadline('#trabalhos h2',d.work_line1,d.work_line2);
    setText('#sobre .about-intro',d.about_intro,true);
    const story=$$('#sobre .about-grid > div:first-child > p:not(.about-intro)');
    if(story[0] && typeof d.about_paragraph1==='string')story[0].textContent=d.about_paragraph1;
    if(story[1] && typeof d.about_paragraph2==='string')story[1].textContent=d.about_paragraph2;
    setText('#servicos .service-intro',d.services_description);
    setText('#contato .contact-grid > div:first-child > p',d.contact_description,true);
    const toggles=[['show_team','#kaio'],['show_services','#servicos'],['show_videos','#videos'],['show_reviews','#ath-reviews']];
    toggles.forEach(([key,sel])=>{if(typeof d[key]==='boolean'){const el=$(sel);if(el)el.hidden=!d[key];}});
    window.athCmsFlags={...d};
  }
  function $$(selector,root=document){return Array.from(root.querySelectorAll(selector));}
  function applySettings(d){
    if(!d || typeof d!=='object')return;
    // Reescreve somente links que ja apontam aos perfis e contatos atuais, sem alterar o restante.
    const anchors=$$('a[href]');
    const newInstagram=safeUrl(d.instagram), newPersonal=safeUrl(d.personal_instagram), newFb=safeUrl(d.facebook);
    const number=String(d.whatsapp||'').replace(/\D/g,'');
    const email=String(d.email||'').trim();
    anchors.forEach(a=>{
      const href=a.getAttribute('href') || '';
      if(newInstagram && /instagram\.com\/atamantisprods/i.test(href))a.href=newInstagram;
      if(newPersonal && /instagram\.com\/kaiosmendes/i.test(href))a.href=newPersonal;
      if(newFb && /facebook\.com\/Athamantisprods/i.test(href))a.href=newFb;
      if(number.length>=10 && number.length<=15 && /^https:\/\/wa\.me\//.test(href)){
        const old=new URL(href);a.href='https://wa.me/'+number+(old.search || '');
      }
      if(email && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) && href.startsWith('mailto:')){
        a.href='mailto:'+email;
        const textnode=Array.from(a.childNodes).find(n=>n.nodeType===3 && n.textContent.includes('@'));
        if(textnode)textnode.textContent=email+' ';
      }
    });
    // OBS.: lead.js original ainda possui destino WhatsApp fixo no submit;
    // alterar o numero aqui muda links existentes, NAO o fluxo interno desse formulario.
  }
  function applyTeam(d){
    if(!d || !Array.isArray(d.members))return;
    const section=$('#kaio');if(!section)return;
    const entries=d.members.filter(m=>m && m.visible!==false && m.name && imgSrc(m.photo));
    if(!entries.length){section.hidden=true;return;}
    const fragment=document.createDocumentFragment();
    if(entries.length>1){
      const header=make('div','ath-team-header');
      header.append(make('span','eyebrow','ATHAMANTIS / NOSSA EQUIPE'));
      header.append(make('h2','',d.heading || 'QUEM DÁ VIDA ÀS IDEIAS'));
      fragment.append(header);
    }
    for(const member of entries){
      const card=make('article','photographer-grid ath-team-member');
      const figure=make('figure');
      const pic=make('img');pic.src=imgSrc(member.photo);pic.alt=member.alt || ('Retrato de '+member.name);pic.loading='lazy';
      figure.append(pic);
      if(member.photo_caption)figure.append(make('figcaption','',member.photo_caption));
      const content=make('div','ath-team-content');
      content.append(make('span','eyebrow',member.eyebrow || member.role || 'ATHAMANTIS'));
      const heading=make('h2');heading.append(document.createTextNode(member.headline1 || member.name));
      if(member.headline2){heading.append(make('br'),make('span','muted',member.headline2));}
      content.append(heading);
      if(member.role && !member.eyebrow)content.append(make('p','ath-team-role',member.role));
      const chunks=String(member.bio||'').split(/\n\s*\n/).map(t=>t.trim()).filter(Boolean);
      chunks.forEach(t=>content.append(make('p','',t)));
      if(Array.isArray(member.links))for(const l of member.links){const url=safeUrl(l.url);if(!url || !l.label)continue;
        const a=make('a','text-link ath-team-link',l.label+' ↗');a.href=url;a.target='_blank';a.rel='noopener noreferrer';content.append(a);
      }
      card.append(figure,content);fragment.append(card);
    }
    section.replaceChildren(fragment);
    if(window.athCmsFlags?.show_team===false)section.hidden=true;
  }
  function applyServices(d){
    const root=$('#packages'); if(!root || !d || !Array.isArray(d.services))return;
    const list=d.services.filter(s=>s && s.visible!==false && s.name);
    if(!list.length)return; // Se lista for vazia, mantem os pacotes originais.
    const fragment=document.createDocumentFragment();
    list.forEach((service,i)=>{
      const details=make('details');if(i===0)details.open=true;
      const summary=make('summary');
      summary.append(make('span','service-number',String(i+1).padStart(2,'0')),make('h3','',service.name),make('span','starting','A PARTIR DE '+(service.start || 'SOB CONSULTA')),make('span','plus','+'));
      details.append(summary);
      const grid=make('div','package-grid');
      const packages=Array.isArray(service.packages)?service.packages:[];
      packages.forEach((pkg,j)=>{
        if(!pkg || !pkg.label)return;
        const card=make('div','package');
        card.append(make('small','', ['INICIAL','INTERMEDIÁRIO','COMPLETO'][j] || 'OPÇÃO '+(j+1)));
        card.append(make('strong','',pkg.price || 'SOB CONSULTA'));
        card.append(make('p','',pkg.label));
        const a=make('a','','Quero esse pacote ↗');a.href='#contato';
        a.dataset.service=service.name;a.dataset.package=pkg.label+' — '+(pkg.price || 'Sob consulta');
        a.addEventListener('click',()=>{
          const form=$('#brief');if(!form)return;
          const select=form.elements.service;
          if(select){const option=Array.from(select.options).find(o=>o.value===service.name);
            if(!option){const o=new Option(service.name,service.name);select.add(o);}select.value=service.name;}
          if(form.elements.idea)form.elements.idea.value='Tenho interesse no pacote '+a.dataset.package+'.\nMinha ideia: ';
        });
        card.append(a);grid.append(card);
      });
      details.append(grid,make('p','package-note',(service.note || '')+' Local, deslocamento e prazo de entrega confirmados na proposta.'));
      fragment.append(details);
    });
    root.replaceChildren(fragment);
  }
  function applyTestimonials(d){
    if(!d || !Array.isArray(d.items))return;
    const items=d.items.filter(x=>x && x.visible!==false && x.name && x.quote);
    const existing=$('#ath-reviews'); if(existing)existing.remove();
    if(!items.length || window.athCmsFlags?.show_reviews===false)return;
    const anchor=$('#videos') || $('#contato');if(!anchor)return;
    const section=make('section','section ath-reviews');section.id='ath-reviews';
    const head=make('div','section-top');head.append(make('span','eyebrow',d.subtitle||'QUEM CONFIOU NO NOSSO OLHAR'));
    section.append(head,make('h2','',d.title || 'PALAVRAS QUE FICAM.'));
    const grid=make('div','ath-review-grid');
    items.forEach(item=>{
      const article=make('article','ath-review');article.append(make('span','ath-review-mark','“'),make('blockquote','',item.quote));
      const identity=make('div','ath-review-person');
      if(imgSrc(item.photo)){const im=make('img');im.src=imgSrc(item.photo);im.loading='lazy';im.alt=item.name;identity.append(im);}
      const who=make('div');who.append(make('strong','',item.name));
      if(item.service)who.append(make('small','',item.service));identity.append(who);article.append(identity);grid.append(article);
    });
    section.append(grid);anchor.before(section);
  }
  Promise.all([
    getJson('data/ath-home-texts.json'),getJson('data/ath-team.json'),
    getJson('data/ath-settings.json'),getJson('data/ath-services.json'),
    getJson('data/ath-testimonials.json')
  ]).then(([home,team,settings,services,testimonials])=>{
    applyHome(home);applyTeam(team);applySettings(settings);applyServices(services);applyTestimonials(testimonials);
  });
})();
