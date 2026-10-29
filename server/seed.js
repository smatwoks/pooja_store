
import "dotenv/config";
import mongoose from "mongoose";
import Category from "./models/category.model.js";
import SubCategory from "./models/subCategory.model.js";
import Product from "./models/product.model.js";

const categories = [
  { name: "Fruits & Vegetables", image: "https://placehold.co/300x300?text=Fruits+Vegetables" },
  { name: "Dairy, Bread & Eggs", image: "https://placehold.co/300x300?text=Dairy" },
  { name: "Snacks & Munchies", image: "https://placehold.co/300x300?text=Snacks" },
  { name: "Beverages", image: "https://placehold.co/300x300?text=Beverages" },
  { name: "Staples", image: "https://placehold.co/300x300?text=Staples" }
];

const catalog = [
  {
    category: "Fruits & Vegetables",
    subcategories: [
      {
        name: "Fresh Fruits",
        products: [
          { name: "Banana", unit: "1 dozen", price: 60, stock: 100, image: "https://placehold.co/400x400?text=Banana" },
          { name: "Apple", unit: "1 kg", price: 180, stock: 50, image: "https://placehold.co/400x400?text=Apple" },
          { name: "Orange", unit: "1 kg", price: 90, stock: 50, image: "https://placehold.co/400x400?text=Orange" }
        ]
      },
      {
        name: "Fresh Vegetables",
        products: [
          { name: "Potato", unit: "1 kg", price: 35, stock: 100, image: "https://placehold.co/400x400?text=Potato" },
          { name: "Tomato", unit: "1 kg", price: 40, stock: 100, image: "https://placehold.co/400x400?text=Tomato" },
          { name: "Onion", unit: "1 kg", price: 45, stock: 100, image: "https://placehold.co/400x400?text=Onion" }
        ]
      }
    ]
  },
  {
    category: "Dairy, Bread & Eggs",
    subcategories: [
      {
        name: "Milk & Dairy",
        products: [
          { name: "Fresh Milk", unit: "500 ml", price: 32, stock: 50, image: "https://placehold.co/400x400?text=Milk" },
          { name: "Butter", unit: "100 g", price: 58, stock: 30, image: "https://placehold.co/400x400?text=Butter" },
          { name: "Curd", unit: "400 g", price: 35, stock: 40, image: "https://placehold.co/400x400?text=Curd" }
        ]
      }
    ]
  },
  {
    category: "Snacks & Munchies",
    subcategories: [
      {
        name: "Chips & Snacks",
        products: [
          { name: "Potato Chips", unit: "1 pack", price: 20, stock: 60, image: "https://placehold.co/400x400?text=Chips" },
          { name: "Biscuits", unit: "1 pack", price: 30, stock: 60, image: "https://placehold.co/400x400?text=Biscuits" }
        ]
      }
    ]
  },
  {
    category: "Beverages",
    subcategories: [
      {
        name: "Juices & Drinks",
        products: [
          { name: "Orange Juice", unit: "1 litre", price: 110, stock: 30, image: "https://placehold.co/400x400?text=Juice" },
          { name: "Mineral Water", unit: "1 litre", price: 20, stock: 100, image: "https://placehold.co/400x400?text=Water" }
        ]
      }
    ]
  },
  {
    category: "Staples",
    subcategories: [
      {
        name: "Rice & Grains",
        products: [
          { name: "Rice", unit: "1 kg", price: 70, stock: 100, image: "https://placehold.co/400x400?text=Rice" },
          { name: "Wheat Flour", unit: "1 kg", price: 45, stock: 80, image: "https://placehold.co/400x400?text=Flour" }
        ]
      }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Stop rather than duplicate or overwrite an existing catalog.
    const existing = await Promise.all([
      Category.countDocuments(),
      SubCategory.countDocuments(),
      Product.countDocuments()
    ]);

    if (existing.some((count) => count > 0)) {
      throw new Error(
        "Catalog data already exists. No records were changed."
      );
    }

    const categoryMap = new Map();

    for (const item of categories) {
      const saved = await Category.create(item);
      categoryMap.set(saved.name, saved._id);
    }

    for (const group of catalog) {
      const categoryId = categoryMap.get(group.category);

      for (const subgroup of group.subcategories) {
        const savedSubcategory = await SubCategory.create({
          name: subgroup.name,
          image: "https://placehold.co/300x300?text=Category",
          category: [categoryId]
        });

        for (const item of subgroup.products) {
          await Product.create({
            name: item.name,
            image: [item.image],
            category: [categoryId],
            subCategory: [savedSubcategory._id],
            unit: item.unit,
            stock: item.stock,
            price: item.price,
            discount: 0,
            description: item.name,
            more_details: {},
            publish: true
          });
        }
      }
    }

    console.log("Catalog created successfully.");
    console.log("Categories:", await Category.countDocuments());
    console.log("Subcategories:", await SubCategory.countDocuments());
    console.log("Products:", await Product.countDocuments());
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
