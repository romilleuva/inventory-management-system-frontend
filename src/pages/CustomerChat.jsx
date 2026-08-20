import { useEffect, useRef, useState } from 'react';
import client from '../api/client';

function getSessionId() {
  let id = sessionStorage.getItem('pp_customer_session');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('pp_customer_session', id);
  }
  return id;
}

export default function CustomerChat() {
  const sessionId = useRef(getSessionId());
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! Welcome to Power Palazzo. Ask me about our Indoor, Outdoor or Smart LED drivers, or say "quote" to request pricing.',
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [lead, setLead] = useState({ name: '', email: '', phone: '' });
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  async function sendMessage(text, leadPayload) {
    if (!text.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text }]);
    setInput('');
    setSending(true);
    try {
      const res = await client.post('/chat/customer', {
        sessionId: sessionId.current,
        text,
        lead: leadPayload,
      });
      setMessages((prev) => [...prev, { sender: 'bot', text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong reaching our assistant. Please try again.' },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    sendMessage(input);
  }

  function handleLeadSubmit(e) {
    e.preventDefault();
    if (!lead.name && !lead.email && !lead.phone) return;
    sendMessage(`Contact details: ${lead.name} / ${lead.email} / ${lead.phone}`, lead);
    setShowLeadForm(false);
    setLead({ name: '', email: '', phone: '' });
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col px-6 py-10">
      <h1 className="mb-1 text-2xl font-bold text-white">Customer Assistant</h1>
      <p className="mb-6 text-sm text-slate-400">
        Ask about products, pricing, or leave your contact details for a callback.
      </p>

      <div
        ref={scrollRef}
        className="flex h-[55vh] flex-col gap-3 overflow-y-auto rounded-xl border border-pp-navy-3 bg-pp-navy-2 p-4"
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
        {sending && <div className="text-xs text-slate-500">Assistant is typing…</div>}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question…"
          className="flex-1 rounded-md border border-pp-navy-4 bg-pp-navy-2 px-4 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-pp-gold"
        />
        <button
          type="submit"
          disabled={sending}
          className="rounded-md bg-pp-gold px-5 py-2 text-sm font-semibold text-pp-navy transition-colors hover:bg-pp-gold-2 disabled:opacity-50"
        >
          Send
        </button>
      </form>

      <button
        onClick={() => setShowLeadForm((v) => !v)}
        className="mt-3 self-start text-xs text-pp-gold underline underline-offset-2"
      >
        {showLeadForm ? 'Cancel' : 'Request a callback / leave your details'}
      </button>

      {showLeadForm && (
        <form
          onSubmit={handleLeadSubmit}
          className="mt-3 grid gap-2 rounded-xl border border-pp-navy-3 bg-pp-navy-2 p-4 sm:grid-cols-3"
        >
          <input
            placeholder="Name"
            value={lead.name}
            onChange={(e) => setLead({ ...lead, name: e.target.value })}
            className="rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-pp-gold"
          />
          <input
            placeholder="Email"
            value={lead.email}
            onChange={(e) => setLead({ ...lead, email: e.target.value })}
            className="rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-pp-gold"
          />
          <input
            placeholder="Phone"
            value={lead.phone}
            onChange={(e) => setLead({ ...lead, phone: e.target.value })}
            className="rounded-md border border-pp-navy-4 bg-pp-navy px-3 py-2 text-sm text-white placeholder-slate-500 outline-none focus:border-pp-gold"
          />
          <button
            type="submit"
            className="rounded-md bg-pp-gold px-4 py-2 text-sm font-semibold text-pp-navy hover:bg-pp-gold-2 sm:col-span-3"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
