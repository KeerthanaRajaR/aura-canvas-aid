const API_BASE_URL = 'http://localhost:8000';

export interface AgentRequest {
  user_id: string;
  intent: string;
  message: string;
}

export interface AgentResponse {
  agent_response: string;
  user_data?: any;
}

export const runAgent = async (request: AgentRequest): Promise<AgentResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/run_agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error calling agent API:', error);
    throw error;
  }
};

export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};