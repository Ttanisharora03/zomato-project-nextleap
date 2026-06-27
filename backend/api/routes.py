import pandas as pd
# pyrefly: ignore [missing-import]
from fastapi import APIRouter, HTTPException
from backend.models.schemas import UserPreferences, RecommendationResponse, RestaurantRecommendation
from backend.data.loader import load_data
from backend.data.filter import filter_restaurants
from backend.llm.parser import get_recommendations

router = APIRouter()

@router.post("/recommend", response_model=RecommendationResponse)
def recommend(prefs: UserPreferences):
    df = load_data()
    
    # Filter restaurants
    results = filter_restaurants(df, prefs.model_dump())
    
    if len(results) == 0:
        raise HTTPException(status_code=404, detail="No restaurants found matching your criteria.")
    
    # Strip heavy fields to prevent context length exceeded
    stripped_results = []
    for r in results[:15]:
        stripped_results.append({
            "restaurant_name": r.get("restaurant_name"),
            "cuisines": r.get("cuisines"),
            "aggregate_rating": r.get("aggregate_rating"),
            "average_cost_for_two": r.get("average_cost_for_two")
        })

    # Call the LLM integration to get recommendations
    try:
        recommendations = get_recommendations(prefs.model_dump(), stripped_results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LLM Error: {str(e)}")
        
    return RecommendationResponse(recommendations=recommendations)

@router.get("/health")
def health_check():
    return {"status": "healthy"}

