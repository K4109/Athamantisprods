/* Monte seu Projeto — preview: preço e serviços derivados de data/ath-services.json. */
(()=>{'use strict';
const $=sel=>document.querySelector(sel);
const $cat=$('#quote-categories'),$options=$('#quote-options'),$sum=$('#quote-summary');
const selected=new Map();let current='Fotografia',services=[];
const money=n=>new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(n);
function price(text){if(!/^R\$\s*[\d.,]+$/.test(String(text||'').trim()))return null;let n=String(text).replace('R$','').trim().replace(/\./g,'').replace(',','.');return Number(n)}
const make=(tag,cls,txt)=>{const el=document.createElement(tag);if(cls)el.className=cls;if(txt!=null)el.textContent=String(txt);return el};
function serviceId(s){return s.name}
function renderCategories(){if(!$cat)return;$cat.replaceChildren();for(const category of ['Fotografia','Audiovisual','Design','Websites']){
 const b=make('button','',category);b.type='button';b.className='ath-quote-secondary';b.style.cssText='display:inline-block;margin:0;border-color:'+(current===category?'#deded8':'#494949')+';color:'+(current===category?'#fff':'#aaa');
 b.setAttribute('aria-pressed',String(current===category));b.addEventListener('click',()=>{current=category;renderCategories();renderOptions()});$cat.append(b);
}}
function renderOptions(){if(!$options)return;$options.replaceChildren();for(const s of services.filter(x=>x.category===current && x.visible!==false)){
 const block=make('article','ath-quote-option');block.setAttribute('aria-pressed',String(selected.has(serviceId(s))));
 const b=make('button','','');b.type='button';b.style.cssText='width:100%;border:0;background:none;color:inherit;padding:0;display:flex;align-items:center;text-align:left;gap:14px';
 const check=make('span','',selected.has(serviceId(s))?'☑':'□');check.style.fontSize='24px';
 const name=make('b','',s.name);b.append(check,name);
 let packages=Array.isArray(s.packages)?s.packages.filter(p=>p.label):[];
 const active=selected.get(serviceId(s));
 b.addEventListener('click',()=>{if(selected.has(serviceId(s)))selected.delete(serviceId(s));else selected.set(serviceId(s),{service:s,packageIndex:0});renderOptions();refresh()});
 block.append(b);block.append(make('small','',s.note||'Projeto personalizado'));
 if(packages.length){
  const label=make('span','ath-quote-summary-label','ESCOLHA UM PACOTE');label.style.marginTop='8px';block.append(label);
  const select=document.createElement('select');select.style.cssText='background:#181818;color:#f2f2ed;border:1px solid #4a4a4a;padding:8px;width:100%;font-size:12px';
  packages.forEach((p,i)=>{let opt=new Option(p.label+' / '+p.price,String(i));select.add(opt)});
  select.value=String(active?.packageIndex??0);
  select.addEventListener('change',()=>{selected.set(serviceId(s),{service:s,packageIndex:Number(select.value)});renderOptions();refresh()});block.append(select);
 }
 const details=make('details');const summary=make('summary','','Ver mais detalhes +');details.append(summary,make('div','ath-opt-details',s.details||s.note||'Entre em contato para definir os detalhes do serviço.'));block.append(details);
 if(packages.length)block.append(make('strong','',packages[active?.packageIndex??0].price));
 $options.append(block);
 }if(!$options.childElementCount)$options.append(make('p','','Nenhum serviço cadastrado nesta categoria.'));
}
function summarize(){let total=0,consult=0,parts=[];for(const item of selected.values()){
 let pkg=item.service.packages?.[item.packageIndex]||{label:'Projeto personalizado',price:'Sob consulta'};
 let v=price(pkg.price);if(v===null)consult++;else total+=v;
 parts.push({name:item.service.name,label:pkg.label,price:pkg.price,value:v});
}return {total,consult,parts}}
function refresh(){let s=summarize();$sum.replaceChildren();if(!s.parts.length){$sum.append(make('p','','Escolha um serviço para começar.'))}else for(let p of s.parts){let line=make('div','ath-quote-summary-item');line.append(make('span','',p.name+' · '+p.label),make('span','',p.price));$sum.append(line)}$('#quote-total').textContent=s.consult && s.parts.every(p=>p.value===null)?'Sob consulta':money(s.total);$('#quote-consult').hidden=!s.consult;
}
function message(withClient=false){let s=summarize(),f=$('#quote-form');let d=new FormData(f);
 let fields=withClient?`Nome: ${d.get('client')||'Não informado'}\nE-mail: ${d.get('email')||'Não informado'}\nWhatsApp: ${d.get('phone')||'Não informado'}\nCidade: ${d.get('city')||'A combinar'}\nIdeia: ${d.get('idea')||'A combinar'}\n\n`:'';
 let items=s.parts.length?s.parts.map(p=>`• ${p.name} — ${p.label} (${p.price})`).join('\n'):'• Gostaria de conversar sobre um projeto personalizado';
 return `ATHAMANTIS — MONTE SEU PROJETO\n\n${fields}Serviços solicitados:\n${items}\n\nInvestimento único estimado: ${s.parts.length && s.parts.every(p=>p.value===null)?'Sob consulta':money(s.total)}${s.consult && s.parts.some(p=>p.value!==null)?` + ${s.consult} serviço(s) sob consulta`:''}\n\nValores sujeitos a confirmação após análise do projeto.`
}
const settings={phone:'5521936188180'};
if(location.protocol!=='file:')fetch('data/ath-settings.json',{cache:'no-store'}).then(r=>r.ok?r.json():null).then(d=>{const phone=String(d?.whatsapp||'').replace(/\D/g,'');if(phone.length>=10&&phone.length<=15)settings.phone=phone;whatsapp()}).catch(()=>{});
function whatsapp(){const msg='Olá! Vim pelo site da Athamantis e gostaria de conversar sobre uma ideia de projeto 😊';$('#quote-whatsapp').href='https://wa.me/'+settings.phone+'?text='+encodeURIComponent(msg)}
const quoteForm=$('#quote-form');
const sendButton=quoteForm.querySelector('[type="submit"]');
let sending=false,lastFingerprint='',lastReference='',lastPayload='';
quoteForm.addEventListener('submit',async e=>{
 e.preventDefault();if(sending||!quoteForm.reportValidity())return;
 if(quoteForm.elements.website.value)return;
 const summary=summarize();
 if(!summary.parts.length){$('#quote-feedback').textContent='Escolha pelo menos um serviço antes de enviar.';return;}
 const client=Object.fromEntries(new FormData(quoteForm));
 const fingerprint=JSON.stringify({client,parts:summary.parts});
 if(lastFingerprint===fingerprint){$('#quote-feedback').textContent='Solicitação '+lastReference+' já enviada. Vamos conversar pelo WhatsApp?';return;}
 if(lastPayload!==fingerprint){lastReference='ATH-'+new Date().toISOString().slice(0,10).replaceAll('-','')+'-'+crypto.randomUUID().slice(0,8).toUpperCase();lastPayload=fingerprint;}
 const reference=lastReference;
 const total=summary.parts.every(p=>p.value===null)?'Sob consulta':money(summary.total)+(summary.consult?' + itens sob consulta':'');
 const payload={
  _subject:'Athamantis · Orçamento '+reference+' · '+client.client.replace(/[\r\n]/g,' '),
  _template:'table',
  _replyto:client.email,
  email:client.email,
  'Pedido':reference,
  'Recebido em':new Date().toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'})+' (Brasília)',
  'Nome':client.client,
  'WhatsApp do cliente':client.phone,
  'Cidade':client.city||'Não informada',
  'Serviços e pacotes':summary.parts.map(p=>'• '+p.name+' — '+p.label+' — '+p.price).join('\n'),
  'Estimativa':total,
  'Ideia completa do cliente':client.idea||'Não informada',
  'Observação':'Estimativa sujeita a confirmação. Valores de aluguel/deslocamento e itens sob consulta devem ser alinhados no atendimento.',
  'Origem':location.origin+location.pathname
 };
 sending=true;sendButton.disabled=true;sendButton.textContent='Enviando solicitação…';quoteForm.setAttribute('aria-busy','true');
 $('#quote-feedback').textContent='Enviando sua ideia. Aguarde um instante.';
 $('#quote-preview').textContent='Pedido '+reference+'\n\n'+message(true);
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),25000);
 try{
  const response=await fetch('https://formsubmit.co/ajax/kaioc360@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(payload),signal:controller.signal});
  const result=await response.json();
  if(!response.ok || ![true,'true'].includes(result.success) || /activat|confirm.*email|verify.*email/i.test(result.message||''))throw Error('Submission not confirmed');
  lastFingerprint=fingerprint;
  $('#quote-feedback').textContent='Solicitação '+reference+' enviada! Se quiser, vamos continuar a conversa pelo WhatsApp.';
 }catch(error){
  $('#quote-feedback').textContent='Não foi possível confirmar o envio. Seus dados continuam aqui. Tente novamente ou fale conosco pelo WhatsApp.';
 }finally{clearTimeout(timer);sending=false;sendButton.disabled=false;sendButton.textContent='Enviar solicitação ↗';quoteForm.removeAttribute('aria-busy');}
});
$('#quote-copy').addEventListener('click',async()=>{let m=message(true);try{await navigator.clipboard.writeText(m);$('#quote-feedback').textContent='Resumo copiado. Você pode colá-lo no seu e-mail.'}catch{$('#quote-preview').textContent=m;$('#quote-feedback').textContent='Resumo exibido acima para copiar.'}});
$('#quote-whatsapp').addEventListener('click',whatsapp);
// same CMS JSON is authoritative when served via Cloudflare; fallback HTML data is for file:// demo only
const fallback=()=>{try{return JSON.parse($('#quote-data-fallback').textContent)}catch{return {services:[]}}};
let prefill=null;try{prefill=JSON.parse(sessionStorage.getItem('ath-quote-prefill')||'null');sessionStorage.removeItem('ath-quote-prefill')}catch{}
const ready=d=>{services=(Array.isArray(d?.services)?d.services:[]).map(s=>({...s,packages:(s.packages||[]).map(p=>({...p,price:typeof p.on_request==='boolean'?(p.on_request?'Sob consulta':(typeof p.amount==='number'&&Number.isFinite(p.amount)&&p.amount>=0?money(Number(p.amount)):'Sob consulta')):p.price}))}));if(prefill){for(const key of ['client','city','idea'])if(prefill[key])quoteForm.elements[key].value=String(prefill[key]);}const requested=prefill?.service||new URLSearchParams(location.search).get('servico');const item=services.find(s=>s.name===requested&&s.visible!==false);if(item){current=item.category;selected.set(serviceId(item),{service:item,packageIndex:0});}renderCategories();renderOptions();refresh();whatsapp();};
if(location.protocol==='file:')ready(fallback());else fetch('data/ath-services.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error(r.status);return r.json()}).then(ready).catch(()=>ready(fallback()));
$('#year')?.replaceChildren(document.createTextNode(new Date().getFullYear()));
const toggle=$('#menu-toggle'),nav=$('#nav');if(toggle&&nav)toggle.addEventListener('click',()=>{let open=nav.classList.toggle('open');toggle.textContent=open?'Fechar −':'Menu +';toggle.setAttribute('aria-expanded',String(open))});
})();

