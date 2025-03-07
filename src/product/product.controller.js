import Product from "../product/product.model.js";
import Category from "../category/category.model.js";

export const createProduct = async (req, res) => {
    try {
        const { name, price, categoryId } = req.body;

        if (!name || !price) {
            return res.status(400).json({
                success: false,
                message: "Name and price are required",
            });
        }

        let category = null;

        if (categoryId) {
            category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            }
        } else {

            category = await Category.findOne({ name: "default" });

            if (!category) {
                category = new Category({
                    name: "default",
                    description: "Default category for products without assigned category",
                });
                await category.save();
            }
        }

        const newProduct = new Product({
            name,
            price,
            category: category._id,
        });

        await newProduct.save();

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            product: newProduct,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating product",
            error: error.message,
        });
    }
};
