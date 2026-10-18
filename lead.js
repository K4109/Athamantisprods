/* Compatibilidade com o formulário antigo: continua no fluxo atual de orçamento. */
(()=>{'use strict';
 const form=document.querySelector('#brief');if(!form)return;
 form.addEventListener('submit',e=>{
  e.preventDefault();if(!form.reportValidity()||form.elements['bot-field']?.value)return;
  const d=new FormData(form);
  try{sessionStorage.setItem('ath-quote-prefill',JSON.stringify({client:d.get('name'),city:d.get('city'),idea:d.get('idea'),service:d.get('service')}));}catch{}
  location.assign('monte-seu-projeto.html');
 });
})();
