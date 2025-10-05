import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2 } from "lucide-react";
import { type UserData } from "@/utils/userData";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantProps {
  userData: UserData;
}

const AIAssistant = ({ userData }: AIAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `Hello ${userData.first_name}! I'm your AI health assistant. I can help you with:
      
• Meal planning based on your ${userData.dietary_preference} diet
• Understanding your glucose readings (current: ${userData.latest_cgm} mg/dL)
• Managing your ${userData.medical_conditions !== "None" ? userData.medical_conditions : "health goals"}
• Providing health tips and advice

How can I assist you today?`,
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

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      // Simulate AI response - in production, this would call an actual AI service
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const contextualResponse = getContextualResponse(userMessage, userData);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: contextualResponse },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I'm having trouble responding right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const getContextualResponse = (query: string, user: UserData): string => {
    const lowerQuery = query.toLowerCase();

    // Glucose-related queries
    if (lowerQuery.includes("glucose") || lowerQuery.includes("sugar") || lowerQuery.includes("blood sugar")) {
      const glucose = parseInt(user.latest_cgm);
      if (glucose > 140) {
        return `Your current glucose level is ${glucose} mg/dL, which is elevated. Here are some recommendations:

1. Reduce intake of simple carbohydrates (white rice, sugary foods)
2. Increase physical activity (even a 10-minute walk helps)
3. Stay hydrated with water
4. Consider smaller, more frequent meals
5. Monitor your levels regularly

Since you follow a ${user.dietary_preference} diet, focus on lean proteins, vegetables, and whole grains.`;
      } else if (glucose < 70) {
        return `Your glucose level of ${glucose} mg/dL is low. Please:

1. Have 15g of fast-acting carbs (juice, glucose tablets)
2. Recheck in 15 minutes
3. If still low, repeat step 1
4. Once normalized, have a balanced snack

Stay safe and monitor closely!`;
      } else {
        return `Your glucose level of ${glucose} mg/dL is in a healthy range! Keep up the good work with your ${user.dietary_preference} diet.`;
      }
    }

    // Diet-related queries
    if (lowerQuery.includes("meal") || lowerQuery.includes("food") || lowerQuery.includes("eat") || lowerQuery.includes("diet")) {
      return `Based on your ${user.dietary_preference} diet preference and current glucose level of ${user.latest_cgm} mg/dL, here are some meal suggestions:

**Breakfast:** Vegetable upma with sambar or idli with chutney
**Lunch:** Brown rice with dal, mixed vegetables, and yogurt
**Dinner:** Chapati with vegetable curry and salad
**Snacks:** Fresh fruits, nuts, or sprouts

Remember to:
- Eat balanced meals with protein, fiber, and healthy fats
- Avoid processed foods and excess sugar
- Stay hydrated throughout the day`;
    }

    // Mood-related queries
    if (lowerQuery.includes("mood") || lowerQuery.includes("stress") || lowerQuery.includes("anxious") || lowerQuery.includes("feeling")) {
      return `I notice you're currently feeling ${user.mood.toLowerCase()}. Here are some tips:

1. **Physical Activity:** Even light exercise can boost mood
2. **Mindfulness:** Try 5 minutes of deep breathing
3. **Social Connection:** Reach out to friends or family
4. **Sleep:** Ensure 7-8 hours of quality sleep
5. **Nutrition:** Balanced meals support mental health

Your current mood can affect glucose levels too, so managing stress is important for overall health.`;
    }

    // Health conditions
    if (lowerQuery.includes("condition") || lowerQuery.includes("health") || lowerQuery.includes("medical")) {
      const conditions = user.medical_conditions !== "None" 
        ? `I see you have ${user.medical_conditions}. `
        : "";
      const limitations = user.physical_limitations !== "None"
        ? `Also noting your ${user.physical_limitations.toLowerCase()}. `
        : "";

      return `${conditions}${limitations}Here's some general health advice:

1. Follow your healthcare provider's recommendations
2. Take medications as prescribed
3. Monitor your symptoms regularly
4. Maintain a healthy lifestyle with proper diet and exercise
5. Stay in touch with your medical team

For specific medical advice, always consult with your healthcare provider.`;
    }

    // Default response
    return `I'm here to help with your health journey! I can provide information about:

• Glucose management and monitoring
• Meal planning for your ${user.dietary_preference} diet
• General health and wellness tips
• Understanding your health metrics

What would you like to know more about?`;
  };

  return (
    <Card className="border-border h-[calc(100vh-16rem)]  flex flex-col">
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-3">
                <Loader2 className="w-5 h-5 animate-spin text-primary" />
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
            placeholder="Ask me anything about your health..."
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
      </div>
    </Card>
  );
};

export default AIAssistant;
