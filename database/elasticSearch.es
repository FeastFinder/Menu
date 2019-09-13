POST /api/restaurants/:id/menus
{
  "mappings": {
    "id": { "type": "integer" },
    "mealCategories": [],
      "categories": {
        "subcategories": {
          "meal": {
            "description": { "type": "text"},
            "price": { "type": "half_float" }
          }
        }
      }
    }
  }
}
