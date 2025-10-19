import sqlite3
import pandas as pd
from faker import Faker
import random
import json

# --- 1. Configuration ---
DATABASE_NAME = 'data.db'
NUM_RECORDS = 100 # Requirement: Section 2.2 specifies 100 individuals

# Initialize Faker for generating realistic data
fake = Faker()

# Define the lists of possible values for constraints
DIET_CHOICES = ["vegetarian", "non-vegetarian", "vegan", "pescatarian"]
MEDICAL_CONDITIONS = [
    "None", "Type 2 Diabetes", "High Cholesterol", "Hypertension", 
    "Hypothyroidism", "Asthma", "GERD", "Seasonal Allergies"
]
PHYSICAL_LIMITATIONS = [
    "None", "Mobility Issues (mild)", "Swallowing Difficulties", 
    "Joint Pain (knee)", "Back Pain (chronic)"
]
MOODS = ["Happy", "Neutral", "Excited", "Tired", "Anxious", "Stressed"]

# --- 2. Data Generation ---

def generate_user_data(num_records):
    """Generates a list of 100 synthetic user records."""
    records = []
    for i in range(1, num_records + 1):
        # Generate a sequential User ID starting from 1001
        user_id = str(1000 + i) 
        
        # User Info
        first_name = fake.first_name()
        last_name = fake.last_name()
        city = fake.city()
        
        # Dietary and Medical Info
        dietary_preference = random.choice(DIET_CHOICES)
        # Ensure a decent distribution of Type 2 Diabetes for planning tests
        medical_conditions = random.choices(MEDICAL_CONDITIONS, weights=[60, 10, 10, 5, 5, 5, 3, 2], k=1)[0]
        physical_limitations = random.choice(PHYSICAL_LIMITATIONS)
        
        # Initial State (as required for the agent logic)
        latest_cgm = random.randint(80, 180) # Start in a normal range
        mood = random.choice(MOODS)
        
        records.append({
            'user_id': user_id,
            'first_name': first_name,
            'last_name': last_name,
            'city': city,
            'dietary_preference': dietary_preference,
            'medical_conditions': medical_conditions,
            'physical_limitations': physical_limitations,
            'latest_cgm': latest_cgm,
            'mood': mood
        })
    return records

# --- 3. Database Initialization and Population ---

def initialize_database():
    """Creates the SQLite database and the main Users and Logs tables."""
    conn = sqlite3.connect(DATABASE_NAME)
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
    return conn

def populate_database(conn, data):
    """Inserts the synthetic data into the Users table."""
    cursor = conn.cursor()
    
    # Clear existing data first to avoid UNIQUE constraint errors
    cursor.execute("DELETE FROM Users")
    cursor.execute("DELETE FROM Logs")
    
    # Prepare data for insertion
    insert_data = [(
        d['user_id'], d['first_name'], d['last_name'], d['city'], 
        d['dietary_preference'], d['medical_conditions'], 
        d['physical_limitations'], d['latest_cgm'], d['mood']
    ) for d in data]

    # Insert into Users table
    cursor.executemany('''
        INSERT INTO Users 
        (user_id, first_name, last_name, city, dietary_preference, medical_conditions, physical_limitations, latest_cgm, mood)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', insert_data)

    conn.commit()
    print(f"Successfully created and populated '{DATABASE_NAME}' with {len(data)} user records.")


if __name__ == '__main__':
    # Generate 100 user records
    user_data = generate_user_data(NUM_RECORDS)
    
    # Initialize the database file
    conn = initialize_database()
    
    # Populate the database
    populate_database(conn, user_data)
    
    conn.close()

    print("\nDatabase creation complete. The 'data.db' file is ready to be used by multiagent.py.")