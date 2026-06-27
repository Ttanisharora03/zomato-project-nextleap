import sys
import os

# Add the root directory to sys.path so we can import backend modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.data.loader import load_data
from backend.data.filter import filter_restaurants

def main():
    print("Loading data...")
    df = load_data()
    print(f"Loaded DataFrame with shape: {df.shape}")
    print("Columns:", df.columns.tolist())
    
    preferences = {
        "location": "Delhi",
        "cuisine": "North Indian",
        "budget": "medium",
        "min_rating": 4.0
    }
    print(f"Testing filter with preferences: {preferences}")
    results = filter_restaurants(df, preferences)
    
    print(f"Got {len(results)} results.")
    for i, r in enumerate(results[:3]):
        print(f"{i+1}. {r.get('restaurant_name')} - Rating: {r.get('aggregate_rating')} - Location: {r.get('location')} - Cuisines: {r.get('cuisines')}")

if __name__ == "__main__":
    main()
