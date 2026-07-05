import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    userId: {
        type: Number,
        required: [true, 'User ID is required'],
    },

    productIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Product',
        required: [true, 'Product IDs are required'],
        validate: {
            validator: (arr) => Array.isArray(arr) && arr.length > 0,
            message: 'At least one product ID is required',
        }
    },

    totalAmount: {
        type: Number,
        required: [true, 'Total amount is required'],
        min: [0, 'Total amount cannot be less than 0'],
    },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

export default Order;