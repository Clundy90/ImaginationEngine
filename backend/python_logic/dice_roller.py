import json
import random
import sys

def roll_dice(num_dice=1, sides=20):
    """
    Core math logic for polyhedral dice.
    Returns a list of individual rolls and a grand total.
    """
    rolls = [random.randint(1, sides) for _ in range(num_dice)]
    total = sum(rolls)
    
    return {
        "rolls": rolls,
        "total": total,
        "sides": sides,
        "count": num_dice
    }

if __name__ == "__main__":
    # Pulling arguments from Node: [filename, count, sides]
    try:
        count = int(sys.argv[1]) if len(sys.argv) > 1 else 1
        sides = int(sys.argv[2]) if len(sys.argv) > 2 else 20
    except ValueError:
        count, sides = 1, 20

    print(json.dumps(roll_dice(count, sides)))