export interface NutritionInfo {
  name: string;
  carbs: number;
  protein: number;
  fat: number;
  calories: number;
  servingSize: string;
}

export const nutritionDatabase: Record<string, NutritionInfo> = {
  // South Indian Foods
  dosa: {
    name: "Dosa (Plain)",
    carbs: 28,
    protein: 4,
    fat: 8,
    calories: 200,
    servingSize: "1 medium dosa (100g)"
  },
  idli: {
    name: "Idli",
    carbs: 12,
    protein: 2,
    fat: 1,
    calories: 65,
    servingSize: "1 piece (30g)"
  },
  sambar: {
    name: "Sambar",
    carbs: 15,
    protein: 6,
    fat: 3,
    calories: 110,
    servingSize: "1 cup (200ml)"
  },
  vada: {
    name: "Medu Vada",
    carbs: 25,
    protein: 7,
    fat: 15,
    calories: 250,
    servingSize: "1 piece (80g)"
  },
  upma: {
    name: "Upma",
    carbs: 35,
    protein: 5,
    fat: 8,
    calories: 230,
    servingSize: "1 cup (200g)"
  },
  
  // Rice and Breads
  rice: {
    name: "White Rice (cooked)",
    carbs: 45,
    protein: 4,
    fat: 0.5,
    calories: 205,
    servingSize: "1 cup (200g)"
  },
  "brown rice": {
    name: "Brown Rice (cooked)",
    carbs: 45,
    protein: 5,
    fat: 2,
    calories: 215,
    servingSize: "1 cup (200g)"
  },
  chapati: {
    name: "Chapati",
    carbs: 15,
    protein: 3,
    fat: 3,
    calories: 104,
    servingSize: "1 piece (40g)"
  },
  roti: {
    name: "Roti",
    carbs: 15,
    protein: 3,
    fat: 3,
    calories: 104,
    servingSize: "1 piece (40g)"
  },
  paratha: {
    name: "Paratha",
    carbs: 25,
    protein: 4,
    fat: 10,
    calories: 200,
    servingSize: "1 piece (80g)"
  },
  naan: {
    name: "Naan",
    carbs: 45,
    protein: 8,
    fat: 5,
    calories: 262,
    servingSize: "1 piece (90g)"
  },
  
  // Lentils and Curries
  dal: {
    name: "Dal (Lentil Curry)",
    carbs: 20,
    protein: 9,
    fat: 5,
    calories: 160,
    servingSize: "1 cup (200ml)"
  },
  "dal tadka": {
    name: "Dal Tadka",
    carbs: 22,
    protein: 10,
    fat: 8,
    calories: 190,
    servingSize: "1 cup (200ml)"
  },
  rajma: {
    name: "Rajma (Kidney Bean Curry)",
    carbs: 30,
    protein: 12,
    fat: 6,
    calories: 220,
    servingSize: "1 cup (200g)"
  },
  "chana masala": {
    name: "Chana Masala",
    carbs: 35,
    protein: 14,
    fat: 8,
    calories: 270,
    servingSize: "1 cup (200g)"
  },
  
  // Vegetable Dishes
  "aloo gobi": {
    name: "Aloo Gobi",
    carbs: 25,
    protein: 4,
    fat: 10,
    calories: 200,
    servingSize: "1 cup (200g)"
  },
  "palak paneer": {
    name: "Palak Paneer",
    carbs: 12,
    protein: 18,
    fat: 22,
    calories: 320,
    servingSize: "1 cup (200g)"
  },
  "bhindi masala": {
    name: "Bhindi Masala (Okra)",
    carbs: 15,
    protein: 3,
    fat: 8,
    calories: 140,
    servingSize: "1 cup (150g)"
  },
  
  // Meat Dishes
  curry: {
    name: "Chicken Curry",
    carbs: 10,
    protein: 25,
    fat: 15,
    calories: 280,
    servingSize: "1 cup (200g)"
  },
  "chicken curry": {
    name: "Chicken Curry",
    carbs: 10,
    protein: 25,
    fat: 15,
    calories: 280,
    servingSize: "1 cup (200g)"
  },
  "fish curry": {
    name: "Fish Curry",
    carbs: 8,
    protein: 22,
    fat: 12,
    calories: 230,
    servingSize: "1 cup (200g)"
  },
  "mutton curry": {
    name: "Mutton Curry",
    carbs: 8,
    protein: 28,
    fat: 18,
    calories: 310,
    servingSize: "1 cup (200g)"
  },
  
  // Snacks
  pakora: {
    name: "Pakora (Mixed Vegetable)",
    carbs: 15,
    protein: 3,
    fat: 12,
    calories: 180,
    servingSize: "100g (4-5 pieces)"
  },
  samosa: {
    name: "Samosa",
    carbs: 30,
    protein: 5,
    fat: 15,
    calories: 262,
    servingSize: "1 piece (100g)"
  },
  
  // Dairy
  yogurt: {
    name: "Yogurt (Plain)",
    carbs: 12,
    protein: 10,
    fat: 3,
    calories: 110,
    servingSize: "1 cup (200g)"
  },
  curd: {
    name: "Curd",
    carbs: 12,
    protein: 10,
    fat: 3,
    calories: 110,
    servingSize: "1 cup (200g)"
  },
  paneer: {
    name: "Paneer",
    carbs: 3,
    protein: 18,
    fat: 20,
    calories: 265,
    servingSize: "100g"
  },
  
  // Beverages
  "chai tea": {
    name: "Chai Tea (with milk)",
    carbs: 10,
    protein: 2,
    fat: 2,
    calories: 60,
    servingSize: "1 cup (200ml)"
  },
  lassi: {
    name: "Lassi",
    carbs: 25,
    protein: 8,
    fat: 4,
    calories: 170,
    servingSize: "1 glass (250ml)"
  }
};

export const getNutritionInfo = (foodName: string): NutritionInfo | null => {
  const normalizedName = foodName.toLowerCase().trim();
  return nutritionDatabase[normalizedName] || null;
};

export const searchNutrition = (query: string): NutritionInfo[] => {
  const normalizedQuery = query.toLowerCase().trim();
  return Object.values(nutritionDatabase).filter(food =>
    food.name.toLowerCase().includes(normalizedQuery)
  );
};
