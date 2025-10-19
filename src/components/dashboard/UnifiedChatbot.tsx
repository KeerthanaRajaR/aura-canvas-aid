import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Loader2 } from "lucide-react";
import { runAgent } from "@/utils/api";
import { type UserData } from "@/utils/userData";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface UnifiedChatbotProps {
  userData: UserData;
}

const UnifiedChatbot = ({ userData }: UnifiedChatbotProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Hello ${userData.first_name}! I'm your Health Assistant. You can ask me to:
      
• Log your glucose readings (e.g., "Log glucose 120")
• Track your mood (e.g., "I'm feeling happy today")
• Log food intake (e.g., "I had dal and rice for lunch")
• Generate meal plans (e.g., "Create a meal plan for me")
• Answer health questions

How can I help you today?`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Determine the appropriate intent based on user input
      const intent = determineIntent(input.trim());
      
      // Call the appropriate agent
      const response = await runAgent({
        user_id: userData.user_id,
        intent: intent.type,
        message: input.trim(),
      });

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.agent_response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I apologize, but I'm having trouble responding right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const determineIntent = (input: string) => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes("glucose") || lowerInput.includes("blood sugar") || /\b\d+\b/.test(lowerInput)) {
      return { type: "log_cgm", description: "Glucose logging" };
    }
    
    if (lowerInput.includes("mood") || lowerInput.includes("feel") || 
        lowerInput.includes("happy") || lowerInput.includes("sad") || 
        lowerInput.includes("tired") || lowerInput.includes("excited")) {
      return { type: "log_mood", description: "Mood tracking" };
    }
    
    if (lowerInput.includes("eat") || lowerInput.includes("food") || 
        lowerInput.includes("meal") || lowerInput.includes("lunch") || 
        lowerInput.includes("dinner") || lowerInput.includes("breakfast")) {
      return { type: "log_food", description: "Food logging" };
    }
    
    if (lowerInput.includes("plan") || lowerInput.includes("meal plan") || 
        lowerInput.includes("generate") || lowerInput.includes("suggest")) {
      return { type: "generate_plan", description: "Meal planning" };
    }
    
    // Default to general query for other questions
    return { type: "general_query", description: "General query" };
  };

  return (
    <Card className="border-border h-[calc(100vh-12rem)] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="w-5 h-5 text-primary" />
          Health Assistant
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-1 px-6" ref={scrollRef}>
        <div className="space-y-4 py-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "user" ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                  <span className="text-xs font-medium">
                    {message.role === "user" ? "You" : "Health Assistant"}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your health query here..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            className="bg-primary hover:bg-primary-dark shrink-0"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Try: "Log glucose 120", "I'm feeling happy", "Generate meal plan", etc.
        </p>
      </div>
    </Card>
  );
};

export default UnifiedChatbot;