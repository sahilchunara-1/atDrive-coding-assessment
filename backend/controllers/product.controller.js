import Product from "../models/mongoose/product.model.js";

const productController = {

    getAllProducts: async (req, res) => {
        try {
            const products = await Product.find().sort({ createdAt: -1 });
            return res.status(200).json({
                success: true,
                message: 'Products fetched successfully',
                data: products
            });
        } catch (error) {
            console.log('error in get all products api --->', error);
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    addProduct: async (req, res) => {
        try {
            const { name, price, description } = req.body;
            const product = await Product.create({ name, price, description });
            res.status(201).json({
                success: true,
                message: 'Product created successfully',
                data: product
            });
        } catch (error) {
            console.log('error in creating the products --->', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getProductById: async (req, res) => {
        try {
            const product = await Product.findById(req.params.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Product fetched successfully',
                data: product
            });
        } catch (error) {
            console.log('error in fetching the product --->', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const { name, price, description } = req.body;
            const updateFields = {};
            if (name) updateFields.name = name;
            if (price !== undefined) updateFields.price = price;
            if (description) updateFields.description = description;

            const product = await Product.findOneAndUpdate(
                { _id: req.params.productId },
                { $set: updateFields },
                { new: true, runValidators: true }
            );

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Product updated successfully',
                data: product
            });
        } catch (error) {
            console.log('error in updating the product --->', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    deleteProduct: async (req, res) => {
        try {
            const product = await Product.findByIdAndDelete(req.params.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Product not found'
                });
            }
            return res.status(200).json({
                success: true,
                message: 'Product deleted successfully',
                data: product
            });
        } catch (error) {
            console.log('error in deleting the product --->', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

}

export default productController;