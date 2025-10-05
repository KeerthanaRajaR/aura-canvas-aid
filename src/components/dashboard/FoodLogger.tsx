import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Utensils, Plus, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const commonFoods = ["dosa", "idli", "rice", "dal", "chapati", "sambar", "curry", "yogurt"];

const FoodLogger = () => {
  const [foodInput, setFoodInput] = useState("");
  const [loggedFoods, setLoggedFoods] = useState<string[]>([]);
  const [nutrition] = useState({
    carbs: 0,
    protein: 0,
    fat: 0,
    calories: 0,
  });

  const handleAddFood = (food: string) => {
    if (food && !loggedFoods.includes(food)) {
      setLoggedFoods([...loggedFoods, food]);
      setFoodInput("");
    }
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
                <p className="text-2xl md:text-3xl font-bold text-accent">{nutrition.carbs}g</p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">{nutrition.protein}g</p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">{nutrition.fat}g</p>
                <p className="text-xs text-muted-foreground">Fat</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-bold text-accent">{nutrition.calories}</p>
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
              <p className="text-sm">No foods logged yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {loggedFoods.map((food, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                >
                  <span className="font-medium">{food}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setLoggedFoods(loggedFoods.filter((_, i) => i !== index))
                    }
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FoodLogger;
