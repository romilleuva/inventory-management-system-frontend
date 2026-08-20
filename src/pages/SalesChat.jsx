import { useEffect, useRef, useState } from 'react';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

function getSessionId(userId) {
  const key = `pp_sales_session_${userId}`;
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(key, id);
  }
  return id;
}

const SUGGESTIONS = ['low stock', 'stock outdoor', 'requests', 'help'];

export default function SalesChat() {
  const { user } = useAuth();
  const sessionId = useRef(getSessionId(user.id));
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Hi ${user.name}, I'm your inner sales & purchase management assistant. Try "help" to see what I can do.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function send(text) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    setSending(true);
    try {
      const res = await client.post('/chat/sales', { sessionId: sessionId.current, text });
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: err.response?.data?.message || 'Something went wrong. Please try again.' },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-white">Inner Sales &amp; Purchase Assistant</h1>
      <p className="mb-6 text-sm text-slate-400">Staff-only. Check stock, create purchase requests, and track orders.</p>

      <div className="mb-3 flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-full border border-pp-navy-4 px-3 py-1 text-xs text-slate-300 hover:border-pp-gold hover:text-pp-gold"
          >
            {s}
          </button>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="flex h-[50vh] flex-col gap-3 overflow-y-auto rounded-xl border border-pp-navy-3 bg-pp-navy-2 p-4"
      >
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] whitespace-pre-line rounded-lg px-4 py-2 text-sm ${
                m.sender === 'user' ? 'bg-pp-gold text-pp-navy' : 'bg-pp-navy-3 text-slate-100'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {sending && <div className="text-xs text-slate-500">Thinking…</div>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='e.g. "request 50 COB LED Module 10W"'
          className="flex-1 rounded-md border border-pp-navy-4 bg-pp-navy-2 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-pp-gold"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-md bg-pp-gold px-5 py-2 text-sm font-semibold text-pp-navy hover:bg-pp-gold-2 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
