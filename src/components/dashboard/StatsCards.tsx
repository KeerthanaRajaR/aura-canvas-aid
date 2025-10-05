import { Card, CardContent } from "@/components/ui/card";
import { Activity, Brain, Utensils, TrendingUp } from "lucide-react";
import { type UserData } from "@/utils/userData";

interface StatsCardsProps {
  userData: UserData;
}

const StatsCards = ({ userData }: StatsCardsProps) => {
  const glucose = parseInt(userData.latest_cgm);
  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { text: "Low", color: "text-chart-4" };
    if (value > 140) return { text: "High", color: "text-destructive" };
    return { text: "Normal", color: "text-accent" };
  };

  const glucoseStatus = getGlucoseStatus(glucose);
  const dietType = userData.dietary_preference
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('-');

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Glucose */}
      <Card className="border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Glucose</p>
              <p className="text-3xl font-bold">{glucose}</p>
              <p className={`text-xs font-medium mt-1 ${glucoseStatus.color}`}>{glucoseStatus.text}</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-chart-1/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-chart-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Mood */}
      <Card className="border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Mood</p>
              <p className="text-3xl font-bold">{userData.mood}</p>
              <p className="text-xs text-accent font-medium mt-1">Today</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Brain className="w-6 h-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diet Type */}
      <Card className="border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Diet Type</p>
              <p className="text-2xl font-bold">{dietType}</p>
              <p className="text-xs text-muted-foreground font-medium mt-1">Preference</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-chart-4/10 flex items-center justify-center">
              <Utensils className="w-6 h-6 text-chart-4" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Status */}
      <Card className="border-border hover:shadow-lg transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Health Status</p>
              <p className="text-3xl font-bold">Tracking</p>
              <p className="text-xs text-accent font-medium mt-1">Active</p>
            </div>
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
