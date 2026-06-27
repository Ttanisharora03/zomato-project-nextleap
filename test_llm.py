import json
from backend.data.loader import load_data
from backend.data.filter import filter_restaurants
from backend.llm.parser import get_recommendations
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

df = load_data()
prefs = {
    "location": "bellandur",
    "cuisine": "",
    "budget": "high",
    "min_rating": 4.2,
    "additional_preferences": ""
}

results = filter_restaurants(df, prefs)
print(f"Filtered to {len(results)} restaurants")

# Strip heavy fields to prevent context length exceeded
stripped_results = []
for r in results:
    stripped_results.append({
        "restaurant_name": r.get("restaurant_name"),
        "cuisines": r.get("cuisines"),
        "aggregate_rating": r.get("aggregate_rating"),
        "average_cost_for_two": r.get("average_cost_for_two")
    })

recs = get_recommendations(prefs, stripped_results)
for r in recs:
    print(r.model_dump_json(indent=2))
