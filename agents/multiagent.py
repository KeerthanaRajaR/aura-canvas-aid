from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import re
import sqlite3
from dotenv import load_dotenv

# Agno and Model imports
from agno.agent import Agent
from agno.models.groq import Groq
# NOTE: Removed OpenAIChat import as Groq is used for all models
# NOTE: Removed a standalone Gemini import as Groq is used for all models

# This is a fix for Pydantic v2/v3 compatibility with Agno
BaseModel.model_config = {"protected_namespaces": ()}

# --- 1. ENVIRONMENT SETUP & APP INITIALIZATION ---
load_dotenv() 
app = FastAPI()

# Database path - ensure it's in the correct location
DATABASE_NAME = '../data/data.db'

# Configure CORS (Important for running frontend/backend separately)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for local testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure database tables exist on startup
@app.on_event("startup")
async def startup_event():
    """Initialize database tables on application startup."""
    initialize_database()

def initialize_database():
    """Creates the SQLite database tables if they don't exist."""
    conn = None
    try:
        # Ensure we're looking in the right directory
        db_path = DATABASE_NAME
        if not os.path.exists(db_path):
            # Try alternative path
            db_path = 'data.db'
            if not os.path.exists(db_path):
                # Try relative to parent directory
                db_path = os.path.join('..', 'data', 'data.db')
        
        print(f"[INFO] Using database at: {os.path.abspath(db_path)}")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Create Users table (Primary table for personalized data)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Users (
                user_id TEXT PRIMARY KEY,
                first_name TEXT,
                last_name TEXT,
                city TEXT,
                dietary_preference TEXT,
                medical_conditions TEXT,
                physical_limitations TEXT,
                latest_cgm INTEGER,
                mood TEXT
            )
        ''')
        
        # Create Logs table (For historical data like CGM and Mood, required by agents)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS Logs (
                log_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                type TEXT NOT NULL,      -- e.g., 'CGM', 'MOOD', 'FOOD'
                value_text TEXT,        -- For food description or complex values
                value_int INTEGER,      -- For CGM reading or mood score (if using numerical scale)
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY(user_id) REFERENCES Users(user_id)
            )
        ''')

        conn.commit()
        print("[INFO] Database tables initialized successfully.")
    except sqlite3.Error as e:
        print(f"[ERROR] Database initialization error: {e}")
    finally:
        if conn:
            conn.close()

def get_db_connection():
    """Get database connection with proper path handling."""
    # Try multiple possible paths
    possible_paths = [
        DATABASE_NAME,  # ../data/data.db
        'data.db',      # data.db in current directory
        os.path.join('..', 'data', 'data.db'),  # ../data/data.db
        os.path.join('data', 'data.db')         # data/data.db
    ]
    
    for path in possible_paths:
        if os.path.exists(path):
            return sqlite3.connect(path)
    
    # If no existing database found, use the first path
    return sqlite3.connect(possible_paths[0])

# --- 2. DATA LAYER FUNCTIONS (SQLite) ---

def get_user_data_from_db(user_id):
    """
    Retrieves user data from the SQLite database (Users table).
    CRITICAL FIX: Now correctly fetches 'physical_limitations' (index 5)
    and handles the missing 'last_name' column from the select statement 
    compared to the table definition.
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Select all necessary fields (9 fields exist, we fetch 8 key ones plus user_id)
        cursor.execute(
            """
            SELECT user_id, first_name, last_name, city, dietary_preference, 
                   medical_conditions, physical_limitations, latest_cgm, mood 
            FROM Users 
            WHERE user_id = ?
            """, 
            (user_id,)
        )
        user_record = cursor.fetchone()
        
        if user_record:
            # Map fetched columns by index
            user_data = {
                'user_id': user_record[0],
                'first_name': user_record[1],
                'last_name': user_record[2],
                'city': user_record[3],
                'dietary_preference': user_record[4],
                'medical_conditions': user_record[5],
                'physical_limitations': user_record[6], # Index 6 now
                'latest_cgm': user_record[7],
                'mood': user_record[8]
            }
            return user_data
        return {}
    except sqlite3.Error as e:
        print(f"[ERROR] Database error while fetching user {user_id}: {e}")
        return {}
    finally:
        if conn:
            conn.close()

def log_data_to_db(user_id: str, log_type: str, value_text: str = None, value_int: int = None):
    """
    Logs data into the Logs table and updates the Users table 
    for the latest mood/CGM readings.
    """
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # 1. Insert into Logs table
        cursor.execute(
            '''
            INSERT INTO Logs (user_id, type, value_text, value_int)
            VALUES (?, ?, ?, ?)
            ''',
            (user_id, log_type, value_text, value_int)
        )
        print(f"[DB LOG] Logged {log_type} for user {user_id}. Value: {value_text or value_int}")

        # 2. Update Users table for latest state (CGM and Mood only)
        if log_type == 'CGM' and value_int is not None:
            cursor.execute(
                '''
                UPDATE Users SET latest_cgm = ? WHERE user_id = ?
                ''',
                (value_int, user_id)
            )
            print(f"[DB UPDATE] Updated latest_cgm for user {user_id} to {value_int}.")

        elif log_type == 'MOOD' and value_text is not None:
            cursor.execute(
                '''
                UPDATE Users SET mood = ? WHERE user_id = ?
                ''',
                (value_text, user_id)
            )
            print(f"[DB UPDATE] Updated mood for user {user_id} to {value_text}.")

        conn.commit()
    except sqlite3.Error as e:
        print(f"[ERROR] Database error while logging data: {e}")
    finally:
        if conn:
            conn.close()


# --- 3. AGENT DEFINITIONS (Qwen 32B on Groq) ---
# Using the models specified in your input file
FAST_LLM = Groq(id="qwen/qwen3-32b")
SMART_LLM = Groq(id="qwen/qwen3-32b")

# 1. Greeting Agent
greeting_agent = Agent(
    name="Greeting Agent",
    role="Validates user ID and provides a personalized welcome message.",
    model=FAST_LLM,
    instructions=[
        "Validate the provided User ID. Retrieve the user's First Name and City to greet them personally (e.g., 'Hello, [Name] from [City]!').",
        "If invalid, prompt the user to re-enter a valid ID and block further interaction."
    ],
    markdown=True,
)

# 2. Mood Tracker Agent
mood_tracker_agent = Agent(
    name="Mood Tracker Agent",
    role="Records the user's emotional state and analyzes trends.",
    model=FAST_LLM,
    instructions=[
        "Extract a single mood label (happy, sad, excited, tired, etc.) from the user's input.",
        "Acknowledge the mood (e.g., 'Noted. Feeling 'happy' today!')."
    ],
    markdown=True,
)

# 3. CGM Agent
CGM_agent = Agent(
    name="CGM Agent",
    role="Logs Continuous Glucose Monitor readings and flags alerts if outside the range of 80-300 mg/dL.",
    model=FAST_LLM,
    instructions=[
        "Validate the input glucose reading. If the reading is outside 80-300 mg/dL, issue an immediate, bold **CRITICAL ALERT**."
    ],
    markdown=True,
)

# 4. Food Intake Agent
food_intake_agent = Agent(
    name="Food Intake Agent",
    role="Records meals/snacks and categorizes their macronutrients (carbs/protein/fat) in a table format.",
    model=SMART_LLM,
    instructions=[
        "Take a free-text meal description.",
        "Estimate and categorize the meal into grams of Carbs, Protein, and Fat, and display the result in a markdown table.",
        "Acknowledge the log (e.g., 'Meal logged successfully: [meal description]')."
    ],
    markdown=True,
)

# 5. Meal Planner Agent
meal_planner_agent = Agent(
    name="Meal Planner Agent",
    role="Generates adaptive meal plans based on user health data and constraints.",
    model=SMART_LLM,
    instructions=[
        "Analyze the provided user data (Conditions, Preference, CGM).",
        "If the CGM reading is high or low, generate the next 3 meals specifically designed to bring glucose under control. The plan MUST be a 3-meal plan (Breakfast, Lunch, Dinner).",
        "Respect all dietary preferences and medical constraints.",
        "Display the plan and estimated macros (Carbs/Protein/Fat) in a markdown table."
    ],
    markdown=True,
)

# 6. Interrupt Agent
interrupt_agent = Agent(
    name="Interrupt Agent",
    role="Handles general queries without losing main flow context. Use Google Search for external queries.",
    model=FAST_LLM,
    instructions=[
        "Answer unrelated user queries gracefully.",
        "After answering, route the user back to the main interaction flow with a closing sentence like: 'Now, what would you like to log or plan next?'"
    ],
    markdown=True,
)


# --- 4. API REQUEST SCHEMA ---
class AgentRequest(BaseModel):
    user_id: str
    intent: str  # e.g., 'validate', 'log_cgm', 'generate_plan', 'general_query', 'log_mood', 'log_food'
    message: str # user's free text input


# --- 5. API ENDPOINT (FASTAPI) ---

@app.get("/health")
def health_check():
    """Simple health check endpoint."""
    return {"status": "ok", "message": "Personalized Healthcare Agent is running."}

@app.post("/api/run_agent")
async def run_agent(request: AgentRequest):
    """
    The main endpoint for handling all agent-based interactions, 
    matching the logic from your original run_demo.py flow.
    Enhanced to better handle unified chatbot interactions.
    """
    user_id = request.user_id
    intent = request.intent.lower() # Normalize intent for matching
    user_message = request.message
    
    # Enhanced intent recognition for chatbot
    if intent == "auto_detect":
        intent = auto_detect_intent(user_message)
    
    # 1. Validation/Greeting Intent (Only intent that runs without full user data check)
    if intent == 'validate':
        user_data = get_user_data_from_db(user_id)
        if not user_data:
            return {"agent_response": "Invalid ID. Please use a valid ID, such as '1001', for this demo."}
        
        # Prepare context for the agent
        context_prompt = (
            f"My user ID is {user_id}. Please validate me. My name is {user_data['first_name']} "
            f"and I live in {user_data['city']}."
        )
        response = greeting_agent.run(context_prompt)
        
        # Return user data with response
        return {"agent_response": str(response), "user_data": user_data}
        
    # --- Guards for Log/Plan Intents (Requires Validated User) ---
    user_data = get_user_data_from_db(user_id)
    if not user_data:
         return {"agent_response": "Please validate your User ID before proceeding with logs or plans."}

    # 2. CGM Log Intent
    if intent == 'log_cgm':
        response = CGM_agent.run(user_message)
        
        # Attempt to extract the number for DB update and logging
        try:
            cgm_match = re.search(r'(\d+)', user_message)
            if cgm_match:
                cgm_value = int(cgm_match.group(1))
                if cgm_value > 0:
                    log_data_to_db(user_id, 'CGM', value_int=cgm_value)
                    updated_data = get_user_data_from_db(user_id)
                    return {"agent_response": str(response), "user_data": updated_data}
        except Exception as e:
            print(f"[ERROR] Failed to log CGM data: {e}")
            
        return {"agent_response": str(response), "user_data": user_data}

    # 3. Meal Plan Generation Intent
    elif intent == 'generate_plan':
        # Craft the prompt using the LATEST data from the DB
        prompt = (
            f"Generate an adaptive 3-meal plan. User ID: {user_id}. "
            f"Medical Conditions: {user_data.get('medical_conditions', 'N/A')}. "
            f"Dietary Preference: {user_data.get('dietary_preference', 'N/A')}. "
            f"Physical Limitations: {user_data.get('physical_limitations', 'N/A')}. "
            f"Latest CGM Reading: {user_data.get('latest_cgm', 'N/A')} mg/dL."
        )
        response = meal_planner_agent.run(prompt)
        return {"agent_response": str(response), "user_data": user_data}

    # 4. Food Log Intent
    elif intent == 'log_food':
        response = food_intake_agent.run(user_message)
        
        # Log the raw text of the meal.
        log_data_to_db(user_id, 'FOOD', value_text=user_message)
        
        return {"agent_response": str(response), "user_data": user_data}

    # 5. Mood Log Intent
    elif intent == 'log_mood':
        response = mood_tracker_agent.run(user_message)
        
        # --- LOGGING MOOD ---
        match = re.search(r'(happy|sad|excited|tired|anxious|stressed|neutral)', user_message.lower())
        if match:
            mood_value = match.group(1).capitalize()
            log_data_to_db(user_id, 'MOOD', value_text=mood_value)
        # --- END LOGGING MOOD ---
        
        updated_data = get_user_data_from_db(user_id)
        return {"agent_response": str(response), "user_data": updated_data}

    # 6. General Query (Interrupt)
    elif intent == 'general_query':
        response = interrupt_agent.run(user_message)
        return {"agent_response": str(response), "user_data": user_data}

    return {"agent_response": "Unknown intent. How can I assist you today?"}

def auto_detect_intent(message: str) -> str:
    """Automatically detect the intent based on the user message."""
    lower_message = message.lower()
    
    if "glucose" in lower_message or "blood sugar" in lower_message or re.search(r'\b\d+\b', lower_message):
        return "log_cgm"
    
    if any(word in lower_message for word in ["mood", "feel", "happy", "sad", "tired", "excited", "anxious", "stressed"]):
        return "log_mood"
    
    if any(word in lower_message for word in ["eat", "food", "meal", "lunch", "dinner", "breakfast"]):
        return "log_food"
    
    if any(word in lower_message for word in ["plan", "meal plan", "generate", "suggest"]):
        return "generate_plan"
    
    return "general_query"