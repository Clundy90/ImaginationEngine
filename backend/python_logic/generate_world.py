import json
import random

def generate_world():
    # --- COSMIC DATA (The Big Picture) ---
    planets = ["shimmering supercontinent", "shifting archipelago", "hollowed-out moon", "shattered planar fragment"]
    mythologies = ["two warring sibling gods", "ancient sleeping titans", "a single silent creator", "whispering cosmic dragons"]
    tech_levels = ["a gilded Renaissance era", "gritty steam-powered machinery", "primitive stone-age rituals", "unstable magi-tech"]
    magic_rarity = ["a forgotten myth", "pulsing through every stone", "strictly forbidden by law", "wild and dangerously unpredictable"]
    
    # --- ENVIRONMENTAL DATA (The Local Details) ---
    drainage = ["rapid mountain runoff", "stagnant, mist-choked miasma", "hidden underground rivers", "sinuous, glowing canals"]
    vitality = ["exploding with alien color", "choked by necrotic rot", "petrified and ancient", "thriving against all odds"]
    life_health = ["swarming with bioluminescent beasts", "home to hardy survivors", "twisted by arcane mutations", "silent and watchful"]
    biomes = ["frozen Boreal spires", "crystalline caverns", "obsidian-glass deserts", "floating sky-isles"]

    world_data = {
        "cosmic": {
            "planet": random.choice(planets),
            "mythology": random.choice(mythologies),
            "technology": random.choice(tech_levels),
            "magic": random.choice(magic_rarity)
        },
        "environment": {
            "drainage": random.choice(drainage),
            "vitality": random.choice(vitality),
            "lifeHealth": random.choice(life_health),
            "biome": random.choice(biomes)
        },
        "seed": random.randint(10000, 99999)
    }
    return world_data

if __name__ == "__main__":
    print(json.dumps(generate_world()))