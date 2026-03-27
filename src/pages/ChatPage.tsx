import { useState, useRef, useEffect } from "react";

import { useAppStore } from "@/lib/store";
import { useAuthStore } from "@/lib/auth-store";
import { useAIHistoryStore, AITraceStep } from "@/lib/ai-history-store";
import { useAlertsStore } from "@/lib/alerts-store";
import { equipmentList } from "@/lib/equipment-data";
import { chatResponse } from "@/lib/ai-engine";
import { ChatMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Bot, User, Loader2, Trash2, Mic, MicOff } from "lucide-react"; // Added Mic icons
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const { logs, analyzedLogs, schedule, chatMessages, addChatMessage, clearChat, loadSampleData, runAnalysis } = useAppStore();
  const user = useAuthStore((s) => s.user);
  const addInteraction = useAIHistoryStore((s) => s.addInteraction);
  const generateAlerts = useAlertsStore((s) => s.generateAlertsFromSchedule);
  
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false); // Voice state
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null); // Speech Recognition Ref

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (schedule.length > 0) {
      generateAlerts(schedule, equipmentList);
    }
  }, [schedule]);

  const hasData = schedule.length > 0;

  const handleSend = async () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: text, timestamp: new Date() };
    addChatMessage(userMsg);
    setInput("");
    setIsTyping(true);

    await new Promise((r) => setTimeout(r, 800));

    const traceSteps: AITraceStep[] = [
      { step: 1, action: "Parse Query", detail: `Analyzing: "${text.slice(0, 50)}..."`, timestamp: new Date().toISOString() },
      { step: 2, action: "Context Retrieval", detail: `Checked ${logs.length} logs`, timestamp: new Date().toISOString() },
      { step: 3, action: "Pattern Matching", detail: "Identifying keywords via AI Engine", timestamp: new Date().toISOString() },
      { step: 4, action: "Response Generation", detail: "Formatting Markdown response", timestamp: new Date().toISOString() },
    ];

    const response = chatResponse(text, analyzedLogs.length ? analyzedLogs : logs, schedule);
    const botMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() };
    addChatMessage(botMsg);

    addInteraction({
      query: text,
      response,
      user: user?.email || "unknown",
      role: user?.role || "user",
      traceSteps,
    });

    setIsTyping(false);
    inputRef.current?.focus();
  };

  const quickStart = async () => {
    loadSampleData();
    await runAnalysis();
  };

  const suggestions = [
    "Which machines are at highest risk?",
    "Show maintenance schedule",
    "Give me a system overview",
    "Why is M-101 critical?",
  ];

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col animate-fade-up">
      <div className="flex items-center justify-between pb-4">
        <h1 className="text-2xl font-bold tracking-tight font-display">AI Maintenance Assistant</h1>
        {chatMessages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearChat} className="text-muted-foreground hover:text-destructive">
            <Trash2 className="mr-1 h-4 w-4" />Clear
          </Button>
        )}
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto rounded-xl border bg-card p-4 shadow-sm space-y-4 border-border/50">
        {!hasData && chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
               <Bot className="h-10 w-10 text-primary" />
            </div>
            <p className="font-medium text-lg text-foreground">System Offline</p>
            <p className="text-sm text-muted-foreground mb-6">Load factory data to enable AI predictions.</p>
            <Button className="rounded-full px-8 bg-primary hover:bg-blue-600 shadow-lg shadow-primary/20" onClick={quickStart}>
              Load & Analyze Data
            </Button>
          </div>
        )}

        {hasData && chatMessages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-xl font-bold font-display text-primary mb-2">How can I help you?</h2>
            <p className="text-sm text-muted-foreground mb-6">Ask me anything or use a shortcut below:</p>
            <div className="flex flex-wrap justify-center gap-2 max-w-2xl">
              {suggestions.map((s) => (
                <button 
                    key={s} 
                    onClick={() => setInput(s)} 
                    className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-medium text-primary transition-all hover:bg-primary hover:text-white active:scale-95 shadow-sm"
                >
                    {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {chatMessages.map((msg) => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
            {msg.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white shadow-md">
                <Bot className="h-4 w-4" />
              </div>
            )}
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
              msg.role === "user" 
              ? "bg-primary text-white rounded-tr-none" 
              : "bg-secondary text-secondary-foreground border border-border/50 rounded-tl-none"
            }`}>
              {msg.role === "assistant" ? (
                <div className="prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ) : msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 border border-white/20 text-white shadow-md">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <Bot className="h-4 w-4" />
            </div>
            <div className="rounded-2xl bg-secondary px-4 py-3 border border-border/50">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="mt-4 flex gap-2 relative">
        <div className="relative flex-1">
          <Input 
            ref={inputRef} 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder={isListening ? "Listening..." : "Ask about equipment health..."} 
            disabled={!hasData || isTyping} 
            className={`pr-12 h-12 rounded-xl bg-card border-border/50 transition-all focus:ring-2 focus:ring-primary/20 ${isListening ? "border-primary ring-2 ring-primary/20 shadow-primary/10 shadow-lg" : ""}`} 
          />
          
          {/* VOICE INPUT BUTTON */}
          <button
            type="button"
            onClick={toggleListening}
            disabled={!hasData || isTyping}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
              isListening 
              ? "text-destructive bg-destructive/10 animate-pulse" 
              : "text-muted-foreground hover:text-primary hover:bg-primary/10"
            }`}
          >
            {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </button>
        </div>

        <Button 
          type="submit" 
          size="icon" 
          disabled={!input.trim() || !hasData || isTyping}
          className="h-12 w-12 rounded-xl bg-primary hover:bg-blue-600 shadow-lg shadow-primary/20 transition-all active:scale-95"
        >
          <Send className="h-5 w-5 text-white" />
        </Button>
      </form>
    </div>
  );
}