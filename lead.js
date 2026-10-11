/* Netlify Forms must be enabled and email notifications configured in the host dashboard. */
(() => {
  const form = document.querySelector('#brief');
  if (!form) return;
  const button = form.querySelector('[type="submit"]');
  const originalLabel = button.innerHTML;
  const status = document.querySelector('#status');
  const fallback = document.querySelector('#fallback');
  const whatsapp = document.querySelector('#continue-whatsapp');
  let pending = false;
  let lastAccepted = '';

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const data = new FormData(form);
    if (data.get('bot-field')) return;
    const date = data.get('date');
    const displayDate = date ? date.split('-').reverse().join('/') : 'A combinar';
    const message = `Olá, Kaio!\n\nMeu nome é ${data.get('name')}.\nTenho interesse em: ${data.get('service')}.\nCidade: ${data.get('city')}.\nData prevista: ${displayDate}.\n\nMinha ideia:\n${data.get('idea')}\n\nPodemos conversar sobre um orçamento?`;
    const target = `https://wa.me/5521936188180?text=${encodeURIComponent(message)}`;
    document.querySelector('#message').value = message;
    whatsapp.href = target;
    data.set('form-name', 'orcamento-athamantis');
    data.set('subject', 'Athamantis — Novo pedido de orçamento');
    data.set('resumo', message);
    const payload = new URLSearchParams(data).toString();
    fallback.hidden = false;
    whatsapp.hidden = true;
    pending = true;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    button.textContent = 'Preparando seu atendimento…';
    status.textContent = 'Enviando seu pedido antes de abrir o WhatsApp…';
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12000);
    let accepted = false;
    try {
      if (payload !== lastAccepted) {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: payload,
          signal: controller.signal
        });
        if (!response.ok) throw new Error('Form submission failed');
        lastAccepted = payload;
      }
      accepted = true;
      status.textContent = 'Agora continue no WhatsApp. Se ele não abrir, use o link abaixo ou copie sua mensagem.';
      whatsapp.textContent = 'Abrir WhatsApp';
    } catch {
      status.textContent = 'Não foi possível confirmar o envio do pedido. Tente novamente no botão acima ou continue direto pelo WhatsApp abaixo.';
      whatsapp.textContent = 'Continuar direto pelo WhatsApp';
    } finally {
      clearTimeout(timer);
      pending = false;
      button.disabled = false;
      button.removeAttribute('aria-busy');
      button.innerHTML = originalLabel;
      whatsapp.hidden = false;
    }
    // Navigate only after the form request completes, so leaving the page cannot cancel it.
    if (accepted) window.location.assign(target);
  });
})();
