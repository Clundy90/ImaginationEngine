import json
import random
import requests
import sys
import data_tables  # Importing our custom Data Vault for names and fluff

def generate_npc():
    """
    Constructs a full NPC by combining official D&D 5e API data 
    (Race/Class) with custom localized flavor text (Names/Traits).
    """
    try:
        # 1. API REQUESTS
        # We fetch the list of available races and classes to ensure 5e compatibility
        race_req = requests.get("https://www.dnd5eapi.co/api/races")
        class_req = requests.get("https://www.dnd5eapi.co/api/classes")
        
        # Extract the results array from the JSON response
        races = race_req.json().get('results', [])
        classes = class_req.json().get('results', [])
        
        if not races or not classes:
            return {"error": "Could not retrieve data from D&D API"}

        # 2. SELECTION LOGIC
        # Randomly select one race and one class from the API results
        selected_race = random.choice(races)['name']
        selected_class = random.choice(classes)['name']
        
        # 3. NARRATIVE "FLUFF" CONSTRUCTION
        # Pulling from our data_tables.py to build a unique identity
        first_name = random.choice(data_tables.FIRST_NAMES)
        last_name = random.choice(data_tables.LAST_NAMES)
        
        trait = random.choice(data_tables.TRAITS)
        origin = random.choice(data_tables.ORIGINS)
        motivation = random.choice(data_tables.MOTIVATIONS)
        
        # Formatting the background sentence for better flow (more fluff)
        # Example: "An exile from a fallen kingdom. This Elf has a nervous twitch..."
        full_background = (
            f"{origin.capitalize()}. This {selected_race} {trait}, "
            f"and is currently {motivation}"
        )

        # 4. FINAL OBJECT ASSEMBLY
        return {
            "name": f"{first_name} {last_name}",
            "race": selected_race,
            "class": selected_class,
            "alignment": random.choice([
                "Lawful Good", "Neutral", "Chaotic Neutral", 
                "Chaotic Good", "True Neutral", "Lawful Neutral"
            ]),
            "background": full_background
        }

    except Exception as e:
        # Catching network errors or parsing issues to prevent backend crashes
        return {"error": f"Failed to manifest NPC: {str(e)}"}

if __name__ == "__main__":
    # The Node.js 'spawn' command reads this print output
    # Ensure it is a single valid JSON string
    print(json.dumps(generate_npc()))