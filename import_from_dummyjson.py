"""
Import real product data from the free DummyJSON API (dummyjson.com) into
your e-commerce backend, via your actual /api endpoints.

Requires: pip install requests

STEPS BEFORE RUNNING:
1. Get an ADMIN token (log in as admin@test.com) - needed to create any
   missing categories.
2. Get a SELLER token (log in as seller@test.com) - needed to create products.
3. Paste both tokens below.
4. Run: python import_from_dummyjson.py
"""

import requests

BASE_URL = "http://localhost:8080/api"

ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkB0ZXN0LmNvbSIsImlhdCI6MTc4ODcwNTY0OSwiZXhwIjoxNzg4NzkyMDQ5fQ.1UR28Xa-OHLOMtKUpGw1iwYO4oWT4yYOGnnER04QUQI"
SELLER_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJzZWxsZXJAdGVzdC5jb20iLCJpYXQiOjE3ODg3MDU4MjAsImV4cCI6MTc4ODc5MjIyMH0.ky9kSM6rhzm48rnf93M58Rv9gWd5U3n2FRWDN4eY81Y"

HOW_MANY_PRODUCTS = 100  # DummyJSON has up to 194 total

admin_headers = {"Authorization": f"Bearer {ADMIN_TOKEN}", "Content-Type": "application/json"}
seller_headers = {"Authorization": f"Bearer {SELLER_TOKEN}", "Content-Type": "application/json"}


def get_existing_categories():
    """Returns {category_name_lowercase: id} for whatever's already in your DB."""
    response = requests.get(f"{BASE_URL}/categories")
    response.raise_for_status()
    return {c["name"].lower(): c["id"] for c in response.json()}


def create_category(name):
    response = requests.post(
        f"{BASE_URL}/categories",
        json={"name": name, "description": f"{name} products"},
        headers=admin_headers,
    )
    if response.status_code == 200:
        return response.json()["id"]
    print(f"  Could not create category '{name}': {response.status_code} {response.text}")
    return None


def fetch_dummyjson_products(limit):
    response = requests.get(f"https://dummyjson.com/products?limit={limit}")
    response.raise_for_status()
    return response.json()["products"]


def main():
    if "PASTE_YOUR" in ADMIN_TOKEN or "PASTE_YOUR" in SELLER_TOKEN:
        print("ERROR: Please paste both ADMIN_TOKEN and SELLER_TOKEN first.")
        return

    print("Fetching real product data from DummyJSON...")
    products = fetch_dummyjson_products(HOW_MANY_PRODUCTS)
    print(f"Got {len(products)} products.\n")

    print("Checking your existing categories...")
    existing_categories = get_existing_categories()

    # Figure out which DummyJSON categories you don't have yet, and create them
    needed_categories = {p["category"] for p in products}
    category_id_map = {}

    for cat_name in needed_categories:
        key = cat_name.lower()
        if key in existing_categories:
            category_id_map[cat_name] = existing_categories[key]
        else:
            print(f"  Creating new category: {cat_name}")
            new_id = create_category(cat_name.replace("-", " ").title())
            if new_id:
                category_id_map[cat_name] = new_id

    print(f"\nCreating {len(products)} products...\n")
    success_count = 0
    fail_count = 0

    for i, item in enumerate(products, start=1):
        category_id = category_id_map.get(item["category"])
        if category_id is None:
            print(f"[{i}] SKIPPED (no category id): {item['title']}")
            fail_count += 1
            continue

        price = round(item["price"], 2)
        discount_pct = item.get("discountPercentage", 0)
        discount_price = round(price * (1 - discount_pct / 100), 2) if discount_pct > 0 else None

        product_dto = {
            "name": item["title"],
            "description": item["description"],
            "categoryId": category_id,
            "brand": item.get("brand", item["category"]),
            "price": price,
            "discountPrice": discount_price,
            "stock": item["stock"],
            "imageUrl": item["thumbnail"],
        }

        response = requests.post(f"{BASE_URL}/seller/products", json=product_dto, headers=seller_headers)

        if response.status_code == 200:
            success_count += 1
            print(f"[{i}/{len(products)}] Created: {item['title']}")
        else:
            fail_count += 1
            print(f"[{i}/{len(products)}] FAILED: {item['title']} -> {response.status_code}: {response.text}")

    print(f"\nDone. {success_count} succeeded, {fail_count} failed.")


if __name__ == "__main__":
    main()
