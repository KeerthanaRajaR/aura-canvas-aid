import { runAgent } from './api';

export interface UserData {
  user_id: string;
  first_name: string;
  last_name: string;
  city: string;
  dietary_preference: string;
  medical_conditions: string;
  physical_limitations: string;
  latest_cgm: string;
  mood: string;
}

let usersData: UserData[] | null = null;

export const loadUserData = async (): Promise<UserData[]> => {
  // In a real implementation, this would fetch all users from the backend
  // For now, we'll keep the CSV approach for simplicity
  if (usersData) return usersData;

  try {
    const response = await fetch('/data/users.csv');
    const csvText = await response.text();
    
    const lines = csvText.split('\n');
    const headers = lines[0].split(',');
    
    usersData = lines.slice(1)
      .filter(line => line.trim())
      .map(line => {
        const values = line.split(',');
        const user: any = {};
        headers.forEach((header, index) => {
          user[header.trim()] = values[index]?.trim() || '';
        });
        return user as UserData;
      });
    
    return usersData;
  } catch (error) {
    console.error('Error loading user data:', error);
    return [];
  }
};

export const getUserById = async (userId: string): Promise<UserData | null> => {
  // First try to get user data from backend
  try {
    const response = await runAgent({
      user_id: userId,
      intent: 'validate',
      message: `Validate user ID: ${userId}`
    });
    
    if (response.user_data) {
      return response.user_data as UserData;
    }
  } catch (error) {
    console.warn('Failed to get user data from backend, falling back to CSV:', error);
  }
  
  // Fallback to CSV data
  const users = await loadUserData();
  return users.find(user => user.user_id === userId) || null;
};

export const logGlucoseReading = async (userId: string, glucoseValue: number): Promise<any> => {
  return await runAgent({
    user_id: userId,
    intent: 'log_cgm',
    message: `Log CGM reading: ${glucoseValue} mg/dL`
  });
};

export const logMood = async (userId: string, mood: string): Promise<any> => {
  return await runAgent({
    user_id: userId,
    intent: 'log_mood',
    message: `Log mood: ${mood}`
  });
};

export const logFood = async (userId: string, foodDescription: string): Promise<any> => {
  return await runAgent({
    user_id: userId,
    intent: 'log_food',
    message: `Log food: ${foodDescription}`
  });
};

export const generateMealPlan = async (userId: string): Promise<any> => {
  return await runAgent({
    user_id: userId,
    intent: 'generate_plan',
    message: 'Generate personalized meal plan'
  });
};