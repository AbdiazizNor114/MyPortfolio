const messagesEl = document.getElementById('messages');
const inputEl = document.getElementById('input');
const sendBtn = document.getElementById('send');
const dot = document.getElementById('dot');

const OLLAMA_URLS = [
  'http://localhost:11434/api/chat',
  'http://127.0.0.1:11434/api/chat',
];
const MODEL = 'hf.co/openbmb/MiniCPM5-1B-GGUF';

let history = [];
let isGenerating = false;

marked.setOptions({ gfm: true, breaks: true });

async function requestOllama(messages) {
  let lastError;

  for (const url of OLLAMA_URLS) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: MODEL, messages, stream: true })
      });

      if (!response.ok) throw new Error(`Ollama returned HTTP ${response.status}`);
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('Could not reach Ollama.');
}

function renderBubble(bubble, text) {
  bubble.classList.add('md');
  bubble.innerHTML = marked.parse(text);
  bubble.querySelectorAll('pre code').forEach(block => hljs.highlightElement(block));
  bubble.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.onclick = () => {
      navigator.clipboard.writeText(pre.querySelector('code').innerText);
      btn.textContent = 'Copied!';
      setTimeout(() => btn.textContent = 'Copy', 1500);
    };
    pre.appendChild(btn);
  });
  if (window.MathJax) MathJax.typesetPromise([bubble]);
}

function addMsg(role, text, typing = false) {
  const wrap = document.createElement('div');
  wrap.className = 'msg ' + (role === 'user' ? 'user' : 'ai');
  const av = document.createElement('div');
  av.className = 'avatar ' + (role === 'user' ? 'user' : 'ai');
  av.textContent = role === 'user' ? 'You' : 'AI';
  const bubble = document.createElement('div');
  bubble.className = 'bubble';
  if (typing) {
    bubble.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  } else if (role === 'ai') {
    renderBubble(bubble, text);
  } else {
    bubble.textContent = text;
  }
  wrap.appendChild(av);
  wrap.appendChild(bubble);
  messagesEl.appendChild(wrap);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return bubble;
}

async function send() {
  const text = inputEl.value.trim();
  if (!text || isGenerating) return;

  inputEl.value = '';
  inputEl.style.height = 'auto';
  isGenerating = true;
  sendBtn.disabled = true;

  addMsg('user', text);
  history.push({ role: 'user', content: text });

  const aiBubble = addMsg('ai', '', true);

  try {
    const res = await requestOllama(history);

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = '';
    aiBubble.textContent = '';
    dot.classList.remove('offline');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      for (const line of chunk.split('\n')) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            full += json.message.content;
            aiBubble.textContent = full;
            messagesEl.scrollTop = messagesEl.scrollHeight;
          }
        } catch (_) {}
      }
    }

    history.push({ role: 'assistant', content: full });
    renderBubble(aiBubble, full);

  } catch (error) {
    aiBubble.textContent = `I could not reach Ollama yet. Start it locally, then try again:

Mac: pkill ollama && OLLAMA_ORIGINS="*" ollama serve
Windows: $env:OLLAMA_ORIGINS="*"; ollama serve

Browser error: ${error.message}`;
    aiBubble.classList.add('error');
    dot.classList.add('offline');
  }

  isGenerating = false;
  sendBtn.disabled = false;
  inputEl.focus();
}

sendBtn.addEventListener('click', send);

inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    send();
  }
});

inputEl.addEventListener('input', () => {
  inputEl.style.height = 'auto';
  inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
});
