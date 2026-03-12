import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { railApi } from "@/lib/api";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const suggestedQueries = [
  "Which stations are most vulnerable to cascading delays today?",
  "Show me the current network resilience report",
  "What's the ticket confirmation odds for train 12622 at BPL?",
];

const AIAssistant = ({ embedded = false }: { embedded?: boolean }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "0",
      role: "assistant",
      content: "System Initialized. I am your backend-powered SLM Assistant. You can ask me about network topology, congestion, or ticket odds.",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      // PRO MOVE: Your unified Spring Boot controller handles the context internally.
      // We just send the query to /api/v1/rail-intelligence/ai/chat
      const aiResponseText = await railApi.chatWithAI(text);
      
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiResponseText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (error) {
      console.error("AI Handshake Failed:", error);
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Error: Could not reach the intelligence layer. Ensure your Spring Boot backend is running.",
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setTyping(false);
    }
  };

  const containerClass = embedded
    ? "glass-card flex flex-col h-[440px]"
    : "flex flex-col h-[calc(100vh-7rem)]";

  return (
    <div className={containerClass}>
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="p-2 rounded-lg bg-primary/10">
          <Bot className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Railway SLM Assistant</h3>
          <p className="text-xs text-muted-foreground">Connected to Unified Spring Engine</p>
        </div>
        <Sparkles className="h-4 w-4 text-primary ml-auto" />
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "flex-row-reverse")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0", msg.role === "assistant" ? "bg-primary/10" : "bg-secondary")}>
                {msg.role === "assistant" ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-muted-foreground" />}
              </div>
              <div className={cn("max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap", msg.role === "assistant" ? "bg-secondary/60" : "bg-primary/10 text-foreground")}>
                {msg.content}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
              <div className="bg-secondary/60 rounded-xl px-4 py-3 text-sm">
                <span className="inline-flex gap-1">
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                  <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                </span>
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {suggestedQueries.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-primary/10 hover:text-primary transition-colors border border-border"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="p-4 border-t border-border">
        <form
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI about network status..."
            className="flex-1 bg-secondary/60 border-border"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || typing}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;