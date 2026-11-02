/* Prime Fresh Oil Mills chatbot frontend.
 * Expected API: POST /api/chat
 * Request:  { message: string, history: [{ role: 'user'|'assistant', content: string }] }
 * Response: { reply: string }
 */
(() => {
  'use strict';

  // Determine backend API URL dynamically:
  // When running frontend on port 8000 (Python simple server) or 5500 (Live Server), proxy/connect to Express on port 3000
  const API_URL = (window.location.port === '8000' || window.location.port === '5500' || window.location.port === '5000')
    ? 'http://localhost:3000/api/chat'
    : '/api/chat';
  const MAX_HISTORY_MESSAGES = 10;
  const SALES_PHONE = '+91 90572 92529';

  const launcher = document.getElementById('pfChatLauncher');
  const panel = document.getElementById('pfChatPanel');
  const closeButton = document.getElementById('pfChatClose');
  const clearButton = document.getElementById('pfChatClear');
  const messages = document.getElementById('pfChatMessages');
  const form = document.getElementById('pfChatForm');
  const input = document.getElementById('pfChatInput');
  const sendButton = document.getElementById('pfChatSend');
  const quickActions = document.getElementById('pfChatQuickActions');

  if (!launcher || !panel || !messages || !form || !input || !sendButton) return;

  let history = [];
  let isSending = false;

  function setOpen(open) {
    panel.hidden = !open;
    launcher.setAttribute('aria-expanded', String(open));
    if (open) {
      window.setTimeout(() => input.focus(), 30);
    } else {
      launcher.focus();
    }
  }

  function renderSafeContent(container, text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    parts.forEach(part => {
      if (part.startsWith('http://') || part.startsWith('https://')) {
        const a = document.createElement('a');
        a.href = part;
        a.textContent = part.includes('wa.me') ? 'Open WhatsApp Enquiry →' : part;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.color = '#e0aa32';
        a.style.fontWeight = '700';
        a.style.textDecoration = 'underline';
        container.appendChild(a);
      } else {
        container.appendChild(document.createTextNode(part));
      }
    });
  }

  function addMessage(text, kind) {
    const node = document.createElement('div');
    node.className = `pf-chat-message pf-chat-message--${kind || 'assistant'}`;
    renderSafeContent(node, text);
    messages.appendChild(node);
    messages.scrollTop = messages.scrollHeight;
    return node;
  }

  function addHistory(role, content) {
    history.push({ role, content });
    history = history.slice(-MAX_HISTORY_MESSAGES);
  }

  function setBusy(busy) {
    isSending = busy;
    sendButton.disabled = busy;
    input.disabled = busy;
    sendButton.setAttribute('aria-label', busy ? 'Sending message' : 'Send message');
  }

  async function sendMessage(rawMessage) {
    const message = String(rawMessage || '').trim();
    if (!message || isSending) return;

    if (quickActions) quickActions.hidden = true;
    addMessage(message, 'user');
    addHistory('user', message);
    input.value = '';
    setBusy(true);
    const pending = addMessage('Please wait while I prepare a response...', 'status');

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history: history.slice(0, -1) })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || `Chat service returned ${response.status}`);
      }
      if (!data || typeof data.reply !== 'string' || !data.reply.trim()) {
        throw new Error('The chat service returned an invalid response.');
      }

      pending.remove();
      addMessage(data.reply.trim(), 'assistant');
      addHistory('assistant', data.reply.trim());
    } catch (error) {
      pending.remove();
      addMessage(
        `The assistant is not connected right now. Please contact the Prime Fresh sales team at ${SALES_PHONE} or use the website's WhatsApp option.`,
        'status'
      );
      console.error('[Prime Fresh Chatbot]', error);
    } finally {
      setBusy(false);
      input.focus();
    }
  }

  launcher.addEventListener('click', () => {
    const currentlyOpen = launcher.getAttribute('aria-expanded') === 'true';
    setOpen(!currentlyOpen);
  });

  closeButton?.addEventListener('click', () => setOpen(false));

  clearButton?.addEventListener('click', () => {
    history = [];
    messages.innerHTML = `
      <div class="pf-chat-message pf-chat-message--assistant">
        Hello! Welcome to Prime Fresh Oil Mills. I can help you explore our products, understand our offerings and connect with our sales team for bulk business enquiries. How can I assist you today?
      </div>
    `;
    if (quickActions) {
      quickActions.hidden = false;
      messages.appendChild(quickActions);
    }
    input.value = '';
    input.focus();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage(input.value);
  });

  quickActions?.addEventListener('click', (event) => {
    const button = event.target.closest('button[data-prompt]');
    if (!button) return;
    sendMessage(button.dataset.prompt || button.textContent);
  });

  setOpen(false);
})();
