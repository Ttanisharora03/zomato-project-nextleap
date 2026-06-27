# Context: AI-Powered Restaurant Recommendation System (Zomato Use Case)

This document contains the core context and requirements for building the Zomato-inspired recommendation system.

## 1. Objective
Design and implement an application that:
- Takes user preferences (such as location, budget, cuisine, and ratings).
- Uses a real-world dataset of restaurants.
- Leverages a Large Language Model (LLM) to generate personalized, human-like recommendations.
- Displays clear and useful results to the user.

## 2. System Workflow

### 2.1 Data Ingestion
- **Source**: Load and preprocess the Zomato dataset from Hugging Face: [ManikaSaini/zomato-restaurant-recommendation](https://huggingface.co/datasets/ManikaSaini/zomato-restaurant-recommendation).
- **Extraction**: Extract relevant fields such as restaurant name, location, cuisine, cost, rating, etc.

### 2.2 User Input
Collect the following user preferences:
- Location (e.g., Delhi, Bangalore)
- Budget (low, medium, high)
- Cuisine (e.g., Italian, Chinese)
- Minimum rating
- Any additional preferences (e.g., family-friendly, quick service)

### 2.3 Integration Layer
- Filter and prepare relevant restaurant data based on the provided user input.
- Pass the structured results into an LLM prompt.
- Design a prompt that helps the LLM reason about the options and rank them accordingly.

### 2.4 Recommendation Engine
Use the LLM to:
- Rank the filtered restaurants.
- Provide explanations detailing why each recommendation fits the user's preferences.
- Optionally summarize the choices.

### 2.5 Output Display
Present the top recommendations in a user-friendly format, including:
- Restaurant Name
- Cuisine
- Rating
- Estimated Cost
- AI-generated explanation
