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
      // Generate personalized meal plan based on user data
      const personalizedMeals = createPersonalizedMealPlan(userData);
      setMealPlan(personalizedMeals);
      setLoading(false);
    }, 1500);
  };

  const createPersonalizedMealPlan = (user: UserData): MealPlan[] => {
    // Base meals that can be customized
    const baseMeals: MealPlan[] = [
      {
        meal: "Breakfast",
        time: "8:00 AM",
        description: "",
        nutrition: { carbs: "0g", protein: "0g", fat: "0g", calories: 0 },
      },
      {
        meal: "Lunch",
        time: "1:00 PM",
        description: "",
        nutrition: { carbs: "0g", protein: "0g", fat: "0g", calories: 0 },
      },
      {
        meal: "Dinner",
        time: "7:00 PM",
        description: "",
        nutrition: { carbs: "0g", protein: "0g", fat: "0g", calories: 0 },
      },
    ];

    // Customize based on dietary preference
    switch (user.dietary_preference) {
      case "vegetarian":
        baseMeals[0].description = "Vegetable upma with coconut chutney and sambar";
        baseMeals[0].nutrition = { carbs: "45g", protein: "12g", fat: "10g", calories: 320 };
        
        baseMeals[1].description = "Brown rice with dal, mixed vegetable curry, and cucumber raita";
        baseMeals[1].nutrition = { carbs: "60g", protein: "18g", fat: "8g", calories: 420 };
        
        baseMeals[2].description = "Whole wheat roti with palak paneer and salad";
        baseMeals[2].nutrition = { carbs: "45g", protein: "20g", fat: "15g", calories: 400 };
        break;
        
      case "non-vegetarian":
        baseMeals[0].description = "Egg omelette with vegetables and two whole wheat toast slices";
        baseMeals[0].nutrition = { carbs: "35g", protein: "25g", fat: "18g", calories: 380 };
        
        baseMeals[1].description = "Grilled chicken breast with quinoa and steamed broccoli";
        baseMeals[1].nutrition = { carbs: "40g", protein: "45g", fat: "12g", calories: 450 };
        
        baseMeals[2].description = "Fish curry with brown rice and mixed vegetable salad";
        baseMeals[2].nutrition = { carbs: "50g", protein: "35g", fat: "15g", calories: 480 };
        break;
        
      case "vegan":
        baseMeals[0].description = "Oatmeal with almond butter, banana slices, and chia seeds";
        baseMeals[0].nutrition = { carbs: "55g", protein: "15g", fat: "12g", calories: 350 };
        
        baseMeals[1].description = "Quinoa bowl with chickpea curry, roasted vegetables, and tahini dressing";
        baseMeals[1].nutrition = { carbs: "65g", protein: "22g", fat: "15g", calories: 450 };
        
        baseMeals[2].description = "Lentil soup with whole grain bread and mixed greens salad";
        baseMeals[2].nutrition = { carbs: "55g", protein: "20g", fat: "8g", calories: 400 };
        break;
        
      default:
        baseMeals[0].description = "Scrambled eggs with whole wheat toast and avocado";
        baseMeals[0].nutrition = { carbs: "35g", protein: "25g", fat: "18g", calories: 400 };
        
        baseMeals[1].description = "Grilled chicken breast with sweet potato and green beans";
        baseMeals[1].nutrition = { carbs: "45g", protein: "35g", fat: "12g", calories: 440 };
        
        baseMeals[2].description = "Baked salmon with quinoa and roasted asparagus";
        baseMeals[2].nutrition = { carbs: "42g", protein: "38g", fat: "20g", calories: 500 };
    }

    // Adjust based on medical conditions
    if (user.medical_conditions.toLowerCase().includes("diabetes")) {
      // Lower carb options for diabetes
      baseMeals[0].description = baseMeals[0].description.replace("upma", "vegetable poha");
      baseMeals[0].nutrition = { carbs: "30g", protein: "10g", fat: "8g", calories: 250 };
      
      baseMeals[1].description = baseMeals[1].description.replace("brown rice", "cauliflower rice");
      baseMeals[1].nutrition = { carbs: "25g", protein: "20g", fat: "10g", calories: 300 };
      
      baseMeals[2].description = baseMeals[2].description.replace("brown rice", "quinoa");
      baseMeals[2].nutrition = { carbs: "35g", protein: "25g", fat: "12g", calories: 350 };
    } else if (user.medical_conditions.toLowerCase().includes("hypertension")) {
      // Low sodium options for hypertension
      baseMeals[0].description += " (low sodium)";
      baseMeals[1].description += " (low sodium)";
      baseMeals[2].description += " (low sodium)";
    }

    // Adjust based on current glucose levels
    const glucoseLevel = parseInt(user.latest_cgm);
    if (glucoseLevel > 140) {
      // High glucose - focus on low glycemic foods
      baseMeals.forEach(meal => {
        meal.description += " (low glycemic)";
        // Reduce carbs slightly
        const carbs = parseInt(meal.nutrition.carbs);
        meal.nutrition.carbs = `${Math.max(10, carbs - 10)}g`;
        meal.nutrition.calories = Math.max(200, meal.nutrition.calories - 50);
      });
    } else if (glucoseLevel < 70) {
      // Low glucose - add some quick energy sources
      baseMeals[0].description += " with dates or honey";
      baseMeals[0].nutrition.carbs = `${parseInt(baseMeals[0].nutrition.carbs) + 15}g`;
      baseMeals[0].nutrition.calories += 80;
    }

    return baseMeals;
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