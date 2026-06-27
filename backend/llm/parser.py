import json
from backend.llm.engine import get_llm
from backend.llm.prompt import RECOMMENDATION_PROMPT
from backend.models.schemas import RestaurantRecommendation

def get_recommendations(preferences: dict, restaurants: list) -> list[RestaurantRecommendation]:
    llm = get_llm()
    chain = RECOMMENDATION_PROMPT | llm
    
    response = chain.invoke({
        "location": preferences.get("location", ""),
        "cuisine": preferences.get("cuisine", ""),
        "budget": preferences.get("budget", ""),
        "min_rating": preferences.get("min_rating", ""),
        "additional_preferences": preferences.get("additional_preferences", ""),
        "restaurants_json": json.dumps(restaurants)
    })
    
    try:
        content = response.content.strip()
        # Handle cases where LLM might wrap in markdown blocks
        if content.startswith("```json"):
            content = content[7:]
        if content.endswith("```"):
            content = content[:-3]
        content = content.strip()
            
        parsed_json = json.loads(content)
        
        recommendations = []
        for item in parsed_json:
            if "cuisines" in item and "cuisine" not in item:
                item["cuisine"] = item.pop("cuisines")
            recommendations.append(RestaurantRecommendation(**item))
            
        return recommendations
    except Exception as e:
        # Fallback or empty if parsing fails
        raise RuntimeError(f"Failed to parse LLM response: {str(e)}\nResponse was: {response.content}")
