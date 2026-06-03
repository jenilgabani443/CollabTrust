'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useSocket } from '@/lib/SocketContext';

/**
 * Render message text with redacted sections highlighted.
 */
function RedactedText({ text, isRedacted }) {
  if (!isRedacted) return <span>{text}</span>;

  const parts = text.split(/(\*\*\*)/g);
  return (
    <span>
      {parts.map((part, i) =>
        part === '***' ? (
          <span
            key={i}
            className="inline-flex items-center gap-0.5 rounded bg-[var(--color-danger)]/15 px-1.5 py-0.5 text-[var(--color-danger)] font-mono text-xs cursor-help"
            title="This content was redacted by the system to prevent sharing restricted contact/payment info."
          >
            <ShieldAlert className="h-3 w-3 inline" />
            ***
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

export default function ChatPanel({ campaignId }) {
  const { user } = useAuth();
  const { connected, joinCampaign, sendMessage, onMessage } = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (campaignId && connected) {
      joinCampaign(campaignId);
    }
  }, [campaignId, connected, joinCampaign]);

  useEffect(() => {
    const unsubscribe = onMessage((msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return unsubscribe;
  }, [onMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(campaignId, input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--color-border)] bg-[var(--color-surface-alt)]">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">Campaign Chat</h3>
        <div className="flex items-center gap-1.5 text-xs">
          {connected ? (
            <>
              <Wifi className="h-3.5 w-3.5 text-[var(--color-success)]" />
              <span className="text-[var(--color-success)] font-medium">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="h-3.5 w-3.5 text-[var(--color-danger)]" />
              <span className="text-[var(--color-danger)] font-medium">Disconnected</span>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="h-16 w-16 rounded-2xl bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
              <Send className="h-7 w-7 text-[var(--color-primary)]" />
            </div>
            <p className="text-sm text-[var(--color-text-muted)]">No messages yet</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">Start the conversation!</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => {
            const isSent = msg.senderId === user?.id;
            return (
              <motion.div
                key={msg.id || i}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    isSent
                      ? 'bg-[var(--color-primary)] text-white rounded-br-md'
                      : 'bg-[var(--color-surface-alt)] text-[var(--color-text)] border border-[var(--color-border)] rounded-bl-md'
                  }`}
                >
                  <RedactedText text={msg.text} isRedacted={msg.isRedacted} />
                  <p className={`text-[10px] mt-1 ${isSent ? 'text-white/60' : 'text-[var(--color-text-muted)]'}`}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'now'}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="flex items-center gap-2 p-3 border-t border-[var(--color-border)] bg-[var(--color-surface-alt)]">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)] transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim() || !connected}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white shadow-lg shadow-[var(--color-primary)]/25 transition-all hover:shadow-[var(--color-primary)]/40 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
