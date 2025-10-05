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
  const users = await loadUserData();
  return users.find(user => user.user_id === userId) || null;
};
