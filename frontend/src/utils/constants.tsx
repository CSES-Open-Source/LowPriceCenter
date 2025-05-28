export const tags = [
  "Electronics",
  "School Supplies",
  "Dorm Essentials",
  "Furniture",
  "Clothes",
  "Miscellaneous",
];

export const orderMethods = {
  "Most Recent": "timeUpdated",
  "Price (low-high)": "priceAsc",
  "Price (high-low)": "priceDesc",
  "Alphabetical (A-Z)": "name",
} as { [key: string]: string };
