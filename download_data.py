import os
# pyrefly: ignore [missing-import]
from datasets import load_dataset

# Only keep columns that the backend actually uses
KEEP_COLUMNS = [
    "name", "online_order", "book_table", "rate", "votes",
    "location", "rest_type", "cuisines",
    "approx_cost(for two people)", "listed_in(type)", "listed_in(city)"
]

def main():
    print("Loading dataset from Hugging Face...")
    ds = load_dataset("ManikaSaini/zomato-restaurant-recommendation", split="train")
    output_dir = os.path.join("backend", "data")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "zomato_dataset.parquet")

    # Convert to pandas, keep only needed columns, save as parquet
    df = ds.to_pandas()
    df = df[KEEP_COLUMNS]
    print(f"Keeping {len(KEEP_COLUMNS)} columns, {len(df)} rows")

    df.to_parquet(output_path, index=False)
    size_mb = os.path.getsize(output_path) / 1024 / 1024
    print(f"Saved to {output_path} ({size_mb:.1f} MB)")

if __name__ == "__main__":
    main()

