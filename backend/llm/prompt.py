# pyrefly: ignore [missing-import]
from langchain_core.prompts import PromptTemplate

RECOMMENDATION_PROMPT = PromptTemplate(
    input_variables=["location", "cuisine", "budget", "min_rating",
                     "additional_preferences", "restaurants_json"],
    template="""
You are an expert restaurant recommendation assistant.

User Preferences:
- Location: {location}
- Preferred Cuisine: {cuisine}
- Budget: {budget}
- Minimum Rating: {min_rating}
- Additional Notes: {additional_preferences}

Here are restaurants that match the basic filters:
{restaurants_json}

Select the TOP 5 restaurants from the list above. For each, return:
1. restaurant_name
2. cuisine
3. rating (as a float)
4. estimated_cost (as a string, e.g., "₹400 for two")
5. explanation (2-3 sentences on why it suits the user)

Respond ONLY with a valid JSON array of 5 objects. No extra text.
"""
)
