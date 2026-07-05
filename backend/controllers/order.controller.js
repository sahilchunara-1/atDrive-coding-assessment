import Order from '../models/mongoose/order.model.js';
import Product from '../models/mongoose/product.model.js';

const orderController = {

    getAllOrders: async (req, res) => {
        try {
            const userId = req.user.id;

            const orders = await Order.find({ userId }).populate('productIds').sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                message: 'Orders fetched successfully',
                data: orders,
            });
        } catch (error) {
            console.log('error in fetching orders --->', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },
    
    createOrder: async (req, res) => {
        try {
            const { productIds } = req.body;
            const uniqueIds = [...new Set(productIds)];

            const userId = req.user.id;

            const products = await Product.find({ _id: { $in: uniqueIds } });

            const priceMap = {};

            products.forEach((p) => { priceMap[p._id.toString()] = p.price; });

            if (products.length !== uniqueIds.length) {

                return res.status(404).json({
                    success: false,
                    message: 'One or more products not found'
                });

            }
            const totalAmount = productIds.reduce((sum, id) => sum + priceMap[id], 0);

            const order = await Order.create({ userId, productIds, totalAmount });

            return res.status(201).json({
                success: true,
                message: 'Order created successfully',
                data: order
            });
        } catch (error) {
            console.log('error in creating order --->', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getOrderById: async (req, res) => {
        try {
            const order = await Order.findById(req.params.orderId).populate('productIds');

            if (!order) {
                return res.status(404).json({
                    success: false,
                    message: 'Order not found'
                });
            }

            if (order.userId != req.user.id) {
                return res.status(403).json({
                    success: false,
                    message: 'You are not authorized to view this order'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Order fetched successfully',
                data: order

            });
        } catch (error) {
            console.log('error in fetching order --->', error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    updateOrder: async (req, res) => {
        try {
            const { productIds } = req.body;

            const existingOrder = await Order.findById(req.params.orderId);
            if (!existingOrder) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }
            if (existingOrder.userId != req.user.id) {
                return res.status(403).json({ success: false, message: 'You are not authorized to update this order' });
            }

            const uniqueIds = [...new Set(productIds)];
            const products = await Product.find({ _id: { $in: uniqueIds } });

            if (products.length !== uniqueIds.length) {
                return res.status(404).json({ success: false, message: 'One or more products not found' });
            }

            const priceMap = {};
            products.forEach((p) => { priceMap[p._id.toString()] = p.price; });

            const totalAmount = productIds.reduce((sum, id) => sum + priceMap[id], 0);

            const order = await Order.findOneAndUpdate(
                { _id: req.params.orderId },
                { $set: { productIds, totalAmount } },
                { new: true, runValidators: true }
            );

            return res.status(200).json({ success: true, message: 'Order updated successfully', data: order });
        } catch (error) {
            console.log('error in updating order --->', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    deleteOrder: async (req, res) => {
        try {
            const existingOrder = await Order.findById(req.params.orderId);
            if (!existingOrder) {
                return res.status(404).json({ success: false, message: 'Order not found' });
            }
            if (existingOrder.userId != req.user.id) {
                return res.status(403).json({ success: false, message: 'You are not authorized to delete this order' });
            }

            const order = await Order.findByIdAndDelete(req.params.orderId);

            return res.status(200).json({ success: true, message: 'Order deleted successfully', data: order });
        } catch (error) {
            console.log('error in deleting order --->', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },
}

export default orderController;
