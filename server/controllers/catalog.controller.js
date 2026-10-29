
import ProductModel from "../models/product.model.js";
import CategoryModel from "../models/category.model.js";
import SubCategoryModel from "../models/subCategory.model.js";

export const deleteAllCatalogController = async (req, res) => {
    try {
        // Require an explicit confirmation from the admin panel.
        if (req.body?.confirmation !== "DELETE_ALL_CATALOG") {
            return res.status(400).json({
                message: 'Confirmation required. Send confirmation: "DELETE_ALL_CATALOG".',
                error: true,
                success: false
            });
        }

        // Delete catalog records only. Do not delete users or carts.
        const products = await ProductModel.deleteMany({});
        const subcategories = await SubCategoryModel.deleteMany({});
        const categories = await CategoryModel.deleteMany({});

        return res.status(200).json({
            message: "Catalog deleted successfully. User accounts and cart records were preserved.",
            error: false,
            success: true,
            deleted: {
                products: products.deletedCount,
                subcategories: subcategories.deletedCount,
                categories: categories.deletedCount
            }
        });
    } catch (error) {
        console.error("Catalog deletion failed:", error);

        return res.status(500).json({
            message: "Catalog deletion failed. Check the database and server logs.",
            error: true,
            success: false
        });
    }
};
