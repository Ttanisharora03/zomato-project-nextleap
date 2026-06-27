import os
# pyrefly: ignore [missing-import]
from datasets import load_dataset

def main():
    print("Loading dataset from Hugging Face...")
    ds = load_dataset("ManikaSaini/zomato-restaurant-recommendation", split="train")
    output_dir = os.path.join("backend", "data")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, "zomato_dataset.parquet")
    print(f"Saving dataset to {output_path}...")
    ds.to_parquet(output_path)
    print("Successfully saved parquet file.")

if __name__ == "__main__":
    main()
