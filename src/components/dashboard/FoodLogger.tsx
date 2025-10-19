import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Utensils, Plus, Clock, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { estimateNutritionInfo, type NutritionInfo } from "@/utils/nutritionData";
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

    const nutritionInfo = estimateNutritionInfo(food);
    setLoggedFoods([...loggedFoods, { name: food, nutrition: nutritionInfo }]);
    setFoodInput("");
    toast({
      title: "Food Added",
      description: `${nutritionInfo.name} added to your log`,
    });
  };

  const handleRemoveFood = (index: number) => {
    setLoggedFoods(loggedFoods.filter((_, i) => i !== index));
  };

  return (
    <Card className="border-border shadow-lg">
      <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-xl text-primary">
          <Utensils className="w-6 h-6 text-secondary" />
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
            className="bg-primary hover:bg-primary/90 text-white shrink-0 shadow-md"
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
        <Card className="bg-gradient-to-br from-primary/10 via-accent-light to-secondary/10 border-primary/20 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base text-primary">
              <Clock className="w-5 h-5 text-secondary" />
              Today's Nutrition Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-3 rounded-lg bg-card/50">
                <p className="text-2xl md:text-3xl font-bold text-chart-1">{Math.round(nutrition.carbs)}g</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Carbs</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/50">
                <p className="text-2xl md:text-3xl font-bold text-chart-2">{Math.round(nutrition.protein)}g</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Protein</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/50">
                <p className="text-2xl md:text-3xl font-bold text-chart-4">{Math.round(nutrition.fat)}g</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Fat</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/50">
                <p className="text-2xl md:text-3xl font-bold text-chart-5">{Math.round(nutrition.calories)}</p>
                <p className="text-xs font-medium text-muted-foreground mt-1">Calories</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logged Foods */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
            <Clock className="w-5 h-5 text-secondary" />
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
                <Card key={index} className="bg-card border-primary/10 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h5 className="font-semibold mb-1 text-primary">{food.nutrition.name}</h5>
                        <p className="text-xs text-muted-foreground mb-2">{food.nutrition.servingSize}</p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          <span className="px-2 py-1 rounded-md bg-chart-1/10">
                            <strong className="text-chart-1">{food.nutrition.carbs}g</strong> Carbs
                          </span>
                          <span className="px-2 py-1 rounded-md bg-chart-2/10">
                            <strong className="text-chart-2">{food.nutrition.protein}g</strong> Protein
                          </span>
                          <span className="px-2 py-1 rounded-md bg-chart-4/10">
                            <strong className="text-chart-4">{food.nutrition.fat}g</strong> Fat
                          </span>
                          <span className="px-2 py-1 rounded-md bg-chart-5/10">
                            <strong className="text-chart-5">{food.nutrition.calories}</strong> Cal
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveFood(index)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 shrink-0"
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