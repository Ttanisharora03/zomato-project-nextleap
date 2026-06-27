import pandas as pd
from typing import Dict, List, Any

def filter_restaurants(df: pd.DataFrame, preferences: dict) -> List[Dict[str, Any]]:
    loc = preferences.get("location", "").lower()
    cuisine = preferences.get("cuisine", "").lower()
    min_rating = preferences.get("min_rating", 3.0)
    budget = preferences.get("budget", "medium").lower()

    filtered_df = df.copy()

    # Location Filter
    if loc and "location" in filtered_df.columns:
        filtered_df = filtered_df[filtered_df['location'].str.contains(loc, case=False, na=False)]
    
    # Rating Filter
    if "aggregate_rating" in filtered_df.columns:
        filtered_df = filtered_df[filtered_df['aggregate_rating'] >= min_rating]

    # Budget Filter
    if budget in ['low', 'medium', 'high'] and 'budget_tier' in filtered_df.columns:
        filtered_df = filtered_df[filtered_df['budget_tier'] == budget]

    # Cuisine Filter (relax constraint if fewer than 3 results)
    cuisine_filtered = filtered_df.copy()
    if cuisine and "cuisines" in cuisine_filtered.columns:
        cuisine_filtered = cuisine_filtered[cuisine_filtered['cuisines'].str.contains(cuisine, case=False, na=False)]

    if len(cuisine_filtered) >= 3:
        filtered_df = cuisine_filtered
    elif len(filtered_df) == 0:
        # If strict filtering gave 0 results, we could relax further, but let's just return what we have
        pass

    # Sort and slice
    if "aggregate_rating" in filtered_df.columns:
        filtered_df = filtered_df.sort_values(by="aggregate_rating", ascending=False).head(15)
    else:
        filtered_df = filtered_df.head(15)

    return filtered_df.to_dict("records")

