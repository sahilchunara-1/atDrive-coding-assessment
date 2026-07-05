import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price can not be less than 0']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema)
export default Product;