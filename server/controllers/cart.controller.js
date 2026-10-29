
import UserModel from "../models/user.model.js";
import CartProductModel from "../models/cartProduct.model.js";
import sendEmail from "../helper/sendEmail.js";

export const addToCartItemController = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required.",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findById(userId).select("name email");

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
                error: true,
                success: false
            });
        }

        const existingItem = await CartProductModel.findOne({
            userId,
            productId
        });

        if (existingItem) {
            return res.status(400).json({
                message: "Product already exists in cart.",
                error: true,
                success: false
            });
        }

        const cartItem = await CartProductModel.create({
            productId,
            quantity: 1,
            userId
        });

        // shopping_cart stores cart item IDs, not product IDs.
        await UserModel.updateOne(
            { _id: userId },
            { $addToSet: { shopping_cart: cartItem._id } }
        );

        // Send a notification without failing the cart operation if email fails.
        try {
            if (user.email) {
                await sendEmail({
                    sendTo: user.email,
                    subject: "Item added to your grocery cart",
                    html: `
                        <div style="font-family:Arial,sans-serif;line-height:1.6">
                            <h2>Hello ${escapeHtml(user.name || "there")}!</h2>
                            <p>An item has been added to your grocery cart.</p>
                            <p><strong>Product ID:</strong> ${escapeHtml(productId)}</p>
                            <p><strong>Quantity:</strong> 1</p>
                            <p>Sign in to your account to view your cart.</p>
                        </div>
                    `
                });
            }
        } catch (emailError) {
            console.error("Cart notification email failed:", emailError);
        }

        return res.status(201).json({
            message: "Product added to cart successfully.",
            error: false,
            success: true,
            data: cartItem
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Unable to add item to cart.",
            error: true,
            success: false
        });
    }
};

export const getCartItemsController = async (req, res) => {
    try {
        const cartItems = await CartProductModel.find({
            userId: req.userId
        }).populate("productId");

        return res.status(200).json({
            message: "Cart items fetched successfully.",
            error: false,
            success: true,
            data: cartItems
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Unable to fetch cart.",
            error: true,
            success: false
        });
    }
};

export const updateCartItemQuantityController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id, quantity } = req.body;

        if (!_id || !Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                message: "Provide a valid cart item ID and quantity of at least 1.",
                error: true,
                success: false
            });
        }

        const cartItem = await CartProductModel.findOne({
            _id,
            userId
        }).populate("productId");

        if (!cartItem) {
            return res.status(404).json({
                message: "Cart item not found.",
                error: true,
                success: false
            });
        }

        const product = cartItem.productId;

        if (!product) {
            return res.status(404).json({
                message: "Product not found.",
                error: true,
                success: false
            });
        }

        if (typeof product.stock === "number" && quantity > product.stock) {
            return res.status(400).json({
                message: `Only ${product.stock} items available in stock.`,
                error: true,
                success: false
            });
        }

        cartItem.quantity = quantity;
        await cartItem.save();

        return res.status(200).json({
            message: "Cart item quantity updated successfully.",
            error: false,
            success: true,
            data: cartItem
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Unable to update cart quantity.",
            error: true,
            success: false
        });
    }
};

export const deleteItemFromCartController = async (req, res) => {
    try {
        const userId = req.userId;
        const { _id } = req.body;

        if (!_id) {
            return res.status(400).json({
                message: "Cart item ID is required.",
                error: true,
                success: false
            });
        }

        const deletedItem = await CartProductModel.findOneAndDelete({
            _id,
            userId
        });

        if (!deletedItem) {
            return res.status(404).json({
                message: "Cart item not found.",
                error: true,
                success: false
            });
        }

        await UserModel.updateOne(
            { _id: userId },
            { $pull: { shopping_cart: deletedItem._id } }
        );

        return res.status(200).json({
            message: "Item deleted from cart successfully.",
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Unable to delete cart item.",
            error: true,
            success: false
        });
    }
};

export const emptyCartController = async (req, res) => {
    try {
        const userId = req.userId;

        await CartProductModel.deleteMany({ userId });

        await UserModel.updateOne(
            { _id: userId },
            { $set: { shopping_cart: [] } }
        );

        return res.status(200).json({
            message: "Cart emptied successfully.",
            error: false,
            success: true
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Unable to empty cart.",
            error: true,
            success: false
        });
    }
};

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}
