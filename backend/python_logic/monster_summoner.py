import json
import random
import requests

def summon_monster():
    try:
        res = requests.get("https://www.dnd5eapi.co/api/monsters")
        monsters = res.json()['results']
        target = random.choice(monsters)
        details = requests.get(f"https://www.dnd5eapi.co{target['url']}").json()
        
        # Get a description from special abilities or actions
        desc = "A mysterious presence looms in the shadows."
        if details.get("special_abilities"):
            desc = details["special_abilities"][0].get("desc")
        elif details.get("actions"):
            desc = details["actions"][0].get("desc")

        return {
            "name": details.get("name"),
            "size": details.get("size"),
            "type": details.get("type"),
            "alignment": details.get("alignment"),
            "hp": details.get("hit_points"),
            "ac": details.get("armor_class")[0].get("value") if details.get("armor_class") else "N/A",
            "cr": details.get("challenge_rating"),
            "stats": {
                "str": details.get("strength"),
                "dex": details.get("dexterity"),
                "con": details.get("constitution")
            },
            "description": desc[:250] + "..." # Shortened fluff
        }
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    print(json.dumps(summon_monster()))