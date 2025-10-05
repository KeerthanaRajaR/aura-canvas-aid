import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Utensils, Plus, Clock, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getNutritionInfo, type NutritionInfo } from "@/utils/nutritionData";
import { toast } from "@/hooks/use-toast";

const commonFoods = ["dosa", "idli", "rice", "dal", "chapati", "sambar", "curry", "yogurt"];

interface LoggedFood {
  name: string;
  nutrition: NutritionInfo;
}

const FoodLogger = () => {
  const [foodInput, setFoodInput] = useState("");
  const [loggedFoods, setLoggedFoods] = useState<LoggedFood[]>([]);
  const [nutrition, setNutrition] = useState({
    carbs: 0,
    protein: 0,
    fat: 0,
    calories: 0,
  });

  useEffect(() => {
    // Calculate total nutrition
    const totals = loggedFoods.reduce(
      (acc, food) => ({
        carbs: acc.carbs + food.nutrition.carbs,
        protein: acc.protein + food.nutrition.protein,
        fat: acc.fat + food.nutrition.fat,
        calories: acc.calories + food.nutrition.calories,
      }),
      { carbs: 0, protein: 0, fat: 0, calories: 0 }
    );
    setNutrition(totals);
  }, [loggedFoods]);

  const handleAddFood = (food: string) => {
    if (!food) return;

    const nutritionInfo = getNutritionInfo(food);
    if (nutritionInfo) {
      setLoggedFoods([...loggedFoods, { name: food, nutrition: nutritionInfo }]);
      setFoodInput("");
      toast({
        title: "Food Added",
        description: `${nutritionInfo.name} added to your log`,
      });
    } else {
      toast({
        title: "Food Not Found",
        description: `Nutrition data for "${food}" not available. Try: ${commonFoods.slice(0, 3).join(", ")}`,
        variant: "destructive",
      });
    }
  };

  const handleRemoveFood = (index: number) => {
    setLoggedFoods(loggedFoods.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Utensils className="w-5 h-5 text-chart-4" />
          Log Food Intake
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Food Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Enter food item (e.g., dosa, rice, chicken curry)"
            value={foodInput}
            onChange={(e) => setFoodInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAddFood(foodInput)}
            className="flex-1"
          />
          <Button 
            onClick={() => handleAddFood(foodInput)}
            size="icon"
            className="bg-chart-4 hover:bg-chart-4/90 text-white shrink-0"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Quick Add Common Foods */}
        <div>
          <p className="text-sm text-muted-foreground mb-2">Quick add common foods:</p>
          <div className="flex flex-wrap gap-2">
            {commonFoods.map((food) => (
              <Badge
                key={food}
                variant="secondary"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                onClick={() => handleAddFood(food)}
              >
                {food}
              </Badge>
            ))}
          </div>
        </div>

        {/* Nutrition Summary */}
        <Card className="bg-accent-light border-accent">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4" />
              Today's Nutrition Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">{Math.round(nutrition.carbs)}g</p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">{Math.round(nutrition.protein)}g</p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">{Math.round(nutrition.fat)}g</p>
                <p className="text-xs text-muted-foreground">Fat</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">{Math.round(nutrition.calories)}</p>
                <p className="text-xs text-muted-foreground">Calories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logged Foods */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-accent" />
            Logged Foods
          </h4>
          {loggedFoods.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Utensils className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No foods logged yet. Try adding: {commonFoods.slice(0, 3).join(", ")}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {loggedFoods.map((food, index) => (
                <Card key={index} className="bg-muted border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h5 className="font-semibold mb-1">{food.nutrition.name}</h5>
                        <p className="text-xs text-muted-foreground mb-2">{food.nutrition.servingSize}</p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <span><strong className="text-chart-1">{food.nutrition.carbs}g</strong> Carbs</span>
                          <span><strong className="text-accent">{food.nutrition.protein}g</strong> Protein</span>
                          <span><strong className="text-chart-4">{food.nutrition.fat}g</strong> Fat</span>
                          <span><strong>{food.nutrition.calories}</strong> Cal</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFood(index)}
                        className="text-destructive hover:text-destructive shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodLogger;
