
import { Router } from "express";

import {
    addProductController,
    deleteProductController,
    getProductByCategoryAndSubCategory,
    getProductByProductId,
    getProductsByCategoryController,
    getProductsController,
    searchProductController,
    updateProductController
} from "../controllers/product.controller.js";

import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const productRouters = Router();

// Admin-only product management
productRouters.post(
    "/add-product",
    authMiddleware,
    adminMiddleware,
    addProductController
);

productRouters.put(
    "/update-product/:id",
    authMiddleware,
    adminMiddleware,
    updateProductController
);

productRouters.delete(
    "/delete-product/:id",
    authMiddleware,
    adminMiddleware,
    deleteProductController
);

// Public product browsing
productRouters.post("/get-product", getProductsController);
productRouters.post(
    "/get-products-by-category",
    getProductsByCategoryController
);
productRouters.post(
    "/get-products-by-category-and-sub-category",
    getProductByCategoryAndSubCategory
);
productRouters.post("/get-product-by-id", getProductByProductId);
productRouters.post("/search-product", searchProductController);

export default productRouters;
