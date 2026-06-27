import sys
import os
from fastapi.testclient import TestClient

# Add the root directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.main import app

client = TestClient(app)

def main():
    print("Testing /api/health...")
    response = client.get("/api/health")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

    print("\nTesting /api/recommend with valid data...")
    payload = {
        "location": "banashankari",
        "cuisine": "south indian",
        "budget": "medium",
        "min_rating": 3.0,
        "additional_preferences": "Must have good filter coffee"
    }
    response = client.post("/api/recommend", json=payload)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"Got {len(data['recommendations'])} recommendations.")
        for r in data['recommendations']:
            print(f"- {r['restaurant_name']} (Rating: {r['rating']})")
    else:
        print(f"Error Response: {response.json()}")

    print("\nTesting /api/recommend with no matches...")
    payload_no_match = {
        "location": "nowhere_city",
        "cuisine": "alien_food",
        "budget": "high",
        "min_rating": 5.0
    }
    response = client.post("/api/recommend", json=payload_no_match)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")

if __name__ == "__main__":
    main()
