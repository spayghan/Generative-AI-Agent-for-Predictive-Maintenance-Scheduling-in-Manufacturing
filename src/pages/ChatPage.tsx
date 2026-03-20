import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/lib/store";
import { chatResponse } from "@/lib/ai-engine";
import { ChatMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Trash2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const { logs, analyzedLogs, schedule, chatMessages, addChatMessage, clearChat, loadSampleData, runAnalysis } = useAppStore();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages, isTyping]);

  const hasData = schedule.length > 0;

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    addChatMessage(userMsg);
    setInput("");
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 800));

    const response = chatResponse(text, analyzedLogs.length ? analyzedLogs : logs, schedule);
    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() };
    addChatMessage(botMsg);
    setIsTyping(false);
    inputRef.current?.focus();
  };

  const quickStart = async () => {
    loadSampleData();
    await runAnalysis();
  };

  const suggestions = [
    "Which machines are at highest risk this week?",
    "Show maintenance history for Pump Unit #4",
    "What caused the last 3 unplanned downtimes?",
    "Generate a 7-day maintenance schedule",
    "Which equipment is overdue for servicing?",
  ];

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col animate-fade-up">
      <div className="flex items-center justify-between pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight font-display">AI Maintenance Assistant</h1>
        </div>
        {chatMessages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat}><Trash2 className="mr-1 h-4 w-4" />Clear</Button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-xl border bg-card p-4 shadow-sm space-y-4">
        {!hasData && chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Bot className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-medium">No analysis data loaded yet</p>
            <p className="mt-1 text-sm text-muted-foreground">Load sample data and run analysis to start chatting.</p>
            <Button className="mt-4" onClick={quickStart}>Load & Analyze Sample Data</Button>
          </div>
        )}

        {hasData && chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-xl font-bold font-display">AI Maintenance Assistant</h2>
            <p className="mt-1 text-sm text-muted-foreground">Try asking:</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2 max-w-2xl">
              {suggestions.map(s => (
                <button key={s} onClick={() => { setInput(s); }} className="rounded-lg border bg-secondary px-3 py-2 text-xs font-medium transition-colors hover:bg-primary hover:text-primary-foreground active:scale-[0.97]">{s}</button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-xl px-4 py-3 text-sm ${
              msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
            }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none [&_table]:text-xs [&_strong]:font-semibold">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-xl bg-secondary px-4 py-3">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="mt-3 flex gap-2">
        <Input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder={hasData ? "Ask about equipment health, maintenance history, or scheduling…" : "Load data first…"} disabled={!hasData || isTyping} className="flex-1" />
        <Button type="submit" size="icon" disabled={!input.trim() || !hasData || isTyping}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
