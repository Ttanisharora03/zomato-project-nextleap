import os
import time
import pandas as pd
import numpy as np
# pyrefly: ignore [missing-import]
from datasets import load_dataset

_df_cache = None

def load_data() -> pd.DataFrame:
    global _df_cache
    if _df_cache is not None:
        return _df_cache

    start_time = time.time()
    parquet_path = os.path.join(os.path.dirname(__file__), "zomato_dataset.parquet")

    if os.path.exists(parquet_path):
        print("Loading Zomato dataset from local parquet file...")
        df = pd.read_parquet(parquet_path)
        print(f"Loaded {len(df)} rows from parquet in {time.time() - start_time:.2f}s")
    else:
        print("WARNING: Local parquet file not found at", parquet_path)
        print("Falling back to Hugging Face download (this may fail on constrained environments)...")
        try:
            ds = load_dataset("ManikaSaini/zomato-restaurant-recommendation", split="train")
            df = ds.to_pandas()
            print(f"Downloaded {len(df)} rows from HF in {time.time() - start_time:.2f}s")
        except Exception as e:
            raise RuntimeError(
                f"Failed to load dataset: {e}\n"
                "The parquet file is missing and Hugging Face download failed.\n"
                "Run 'python download_data.py' locally and commit backend/data/zomato_dataset.parquet to git."
            )

    # Rename columns to match the standard expected by the application
    rename_map = {
        "name": "restaurant_name",
        "approx_cost(for two people)": "average_cost_for_two",
        "rate": "aggregate_rating",
        "listed_in(type)": "listed_in_type"
    }
    df = df.rename(columns=rename_map)

    # Process aggregate_rating (e.g., "4.1/5", "NEW", "-")
    if "aggregate_rating" in df.columns:
        df["aggregate_rating"] = df["aggregate_rating"].astype(str).str.split('/').str[0].str.strip()
        df["aggregate_rating"] = pd.to_numeric(df["aggregate_rating"], errors="coerce")

    # Drop nulls in essential columns if they exist
    cols_to_check = [c for c in ["restaurant_name", "location", "aggregate_rating"] if c in df.columns]
    if cols_to_check:
        df = df.dropna(subset=cols_to_check)

    # Standardize text
    if "restaurant_name" in df.columns:
        df["restaurant_name"] = df["restaurant_name"].astype(str).str.title()
    if "location" in df.columns:
        df["location"] = df["location"].astype(str).str.lower()
    if "cuisines" in df.columns:
        df["cuisines"] = df["cuisines"].astype(str).str.lower()

    # Normalize budget
    if "average_cost_for_two" in df.columns:
        # Convert to string, clean, and convert to numeric
        df["average_cost_for_two"] = (
            df["average_cost_for_two"]
            .astype(str)
            .str.replace(",", "", regex=False)
            .str.extract(r'(\d+)', expand=False)
        )
        df["average_cost_for_two"] = pd.to_numeric(df["average_cost_for_two"], errors="coerce")
        
        conditions = [
            (df['average_cost_for_two'] <= 300),
            (df['average_cost_for_two'] > 300) & (df['average_cost_for_two'] <= 800),
            (df['average_cost_for_two'] > 800)
        ]
        df['budget_tier'] = np.select(conditions, ['low', 'medium', 'high'], default='medium')
    else:
        # Fallback if column doesn't exist
        df['budget_tier'] = 'medium'

    # Deduplicate restaurants to ensure unique establishments per location
    if "restaurant_name" in df.columns and "location" in df.columns:
        df = df.drop_duplicates(subset=["restaurant_name", "location"])

    total_time = time.time() - start_time
    print(f"Dataset ready: {len(df)} restaurants loaded in {total_time:.2f}s")

    _df_cache = df
    return _df_cache

