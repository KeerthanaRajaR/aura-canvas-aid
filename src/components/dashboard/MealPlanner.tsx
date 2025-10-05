import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { type UserData } from "@/utils/userData";

interface MealPlan {
  meal: string;
  time: string;
  description: string;
  nutrition: {
    carbs: string;
    protein: string;
    fat: string;
    calories: number;
  };
}

interface MealPlannerProps {
  userData: UserData;
}

const MealPlanner = ({ userData }: MealPlannerProps) => {
  const [mealPlan, setMealPlan] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const generateMealPlan = () => {
    setLoading(true);
    setTimeout(() => {
      setMealPlan([
        {
          meal: "Breakfast",
          time: "8:00 AM",
          description: "Scrambled eggs with whole wheat toast and avocado",
          nutrition: { carbs: "35g", protein: "25g", fat: "18g", calories: 400 },
        },
        {
          meal: "Lunch",
          time: "1:00 PM",
          description: "Grilled chicken breast with sweet potato and green beans",
          nutrition: { carbs: "45g", protein: "35g", fat: "12g", calories: 440 },
        },
        {
          meal: "Dinner",
          time: "7:00 PM",
          description: "Baked salmon with quinoa and roasted asparagus",
          nutrition: { carbs: "42g", protein: "38g", fat: "20g", calories: 500 },
        },
      ]);
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="w-5 h-5 text-primary" />
          AI Meal Planner
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-primary-light p-4 rounded-lg">
          <p className="text-sm text-foreground mb-4">
            Generate a personalized meal plan based on your health profile, current glucose levels,
            and dietary preferences.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-4">
            <div>
              <span className="text-muted-foreground">Diet Type:</span>{" "}
              <span className="font-semibold capitalize">{userData.dietary_preference.replace('-', ' ')}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Current Glucose:</span>{" "}
              <span className="font-semibold">{userData.latest_cgm} mg/dL</span>
            </div>
            <div>
              <span className="text-muted-foreground">Current Mood:</span>{" "}
              <span className="font-semibold">{userData.mood}</span>
            </div>
          </div>
          <Button 
            onClick={generateMealPlan} 
            disabled={loading}
            className="w-full sm:w-auto bg-primary hover:bg-primary-dark"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {loading ? "Generating..." : "Generate Meal Plan"}
          </Button>
        </div>

        {mealPlan.length > 0 && (
          <div>
            <h4 className="font-semibold mb-4">Your Personalized Meal Plan</h4>
            <div className="space-y-4">
              {mealPlan.map((meal, index) => (
                <Card key={index} className="bg-muted border-border">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-bold text-lg">{meal.meal}</h5>
                          <span className="text-xs text-muted-foreground">{meal.time}</span>
                        </div>
                        <p className="text-sm mb-3">{meal.description}</p>
                        <div className="flex flex-wrap gap-4 text-xs">
                          <div>
                            <span className="text-chart-1 font-bold">{meal.nutrition.carbs}</span>
                            <span className="text-muted-foreground ml-1">Carbs</span>
                          </div>
                          <div>
                            <span className="text-accent font-bold">{meal.nutrition.protein}</span>
                            <span className="text-muted-foreground ml-1">Protein</span>
                          </div>
                          <div>
                            <span className="text-chart-4 font-bold">{meal.nutrition.fat}</span>
                            <span className="text-muted-foreground ml-1">Fat</span>
                          </div>
                          <div>
                            <span className="font-bold">{meal.nutrition.calories}</span>
                            <span className="text-muted-foreground ml-1">Calories</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MealPlanner;
