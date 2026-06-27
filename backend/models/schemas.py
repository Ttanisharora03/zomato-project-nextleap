# pyrefly: ignore [missing-import]
from pydantic import BaseModel
from typing import Literal, Optional, List

class UserPreferences(BaseModel):
    location: str
    cuisine: str
    budget: Literal["low", "medium", "high"]
    min_rating: float = 3.0
    additional_preferences: Optional[str] = ""

class RestaurantRecommendation(BaseModel):
    restaurant_name: str
    cuisine: str
    rating: float
    estimated_cost: str
    explanation: str

class RecommendationResponse(BaseModel):
    recommendations: List[RestaurantRecommendation]
