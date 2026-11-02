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

  /**
   * Safely parses Markdown and sanitizes HTML output using Marked + DOMPurify.
   * Falls back to secure element building if vendor scripts are unavailable.
   */
  function renderSafeContent(container, text, isUser = false) {
    // If it's a user message, render as pure text node to prevent any markup injection
    if (isUser) {
      container.textContent = text;
      return;
    }

    const hasMarked = typeof window.marked !== 'undefined' && typeof window.marked.parse === 'function';
    const hasPurify = typeof window.DOMPurify !== 'undefined' && typeof window.DOMPurify.sanitize === 'function';

    if (hasMarked && hasPurify) {
      // Configure marked
      window.marked.setOptions({
        gfm: true,
        breaks: true
      });

      const rawHtml = window.marked.parse(text);

      // DOMPurify sanitize configuration
      const cleanHtml = window.DOMPurify.sanitize(rawHtml, {
        ALLOWED_TAGS: [
          'p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li',
          'h3', 'h4', 'h5', 'code', 'blockquote', 'hr', 'a', 'span'
        ],
        ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'class'],
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
      });

      container.innerHTML = cleanHtml;

      // Enhance links: target="_blank", rel="noopener noreferrer", and WhatsApp button pill styling
      const links = container.querySelectorAll('a');
      links.forEach((a) => {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        if (a.href.includes('wa.me')) {
          a.classList.add('pf-chat-wa-btn');
          if (!a.textContent.includes('WhatsApp')) {
            a.textContent = 'Chat on WhatsApp →';
          }
        }
      });
    } else {
      // Fallback parser without external dependencies: safe regex parsing
      container.textContent = '';
      const paragraphs = text.split(/\n{2,}/);
      paragraphs.forEach((pText) => {
        const p = document.createElement('p');
        // Simple bold parser
        const parts = pText.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g);
        parts.forEach((part) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            const strong = document.createElement('strong');
            strong.textContent = part.slice(2, -2);
            p.appendChild(strong);
          } else if (part.startsWith('http://') || part.startsWith('https://')) {
            const a = document.createElement('a');
            a.href = part;
            a.textContent = part.includes('wa.me') ? 'Chat on WhatsApp →' : part;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            a.classList.add('pf-chat-link');
            p.appendChild(a);
          } else {
            p.appendChild(document.createTextNode(part));
          }
        });
        container.appendChild(p);
      });
    }
  }

  function addMessage(text, kind) {
    const node = document.createElement('div');
    const isUser = kind === 'user';
    node.className = `pf-chat-message pf-chat-message--${kind || 'assistant'}`;
    renderSafeContent(node, text, isUser);
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
        <p>Hello! I'm the <strong>Prime Fresh AI Assistant</strong>. I can help you explore our products, understand our offerings, calculate seed yields and connect with our sales team for bulk business enquiries. How can I help you today?</p>
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
