import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Brain } from "lucide-react";

const moodData = [
  { date: "Sep 29", score: 2 },
  { date: "Sep 30", score: 5 },
  { date: "Oct 1", score: 3 },
  { date: "Oct 2", score: 5 },
  { date: "Oct 3", score: 2 },
  { date: "Oct 4", score: 2 },
  { date: "Oct 5", score: 2 },
];

const MoodChart = () => {
  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-accent" />
          Mood Trends (7 Days)
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moodData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="date" 
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <YAxis 
                label={{ value: "Mood Score", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "hsl(var(--card))", 
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "14px"
                }}
              />
              <Bar 
                dataKey="score" 
                fill="hsl(var(--accent))" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MoodChart;
