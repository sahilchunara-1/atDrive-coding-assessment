import mongoose from 'mongoose';
import Validator from 'validatorjs';

const getFirstError = (validation) => {
    const allErrors = validation.errors.all();
    const firstField = Object.keys(allErrors)[0];
    return allErrors[firstField][0];
}

export const validateObjectId = (paramName = 'id') => (req, res, next) => {
    const value = req.params[paramName];

    if (!value) {
        return res.status(400).json({ success: false, message: `${paramName} is required` });
    }

    if (!mongoose.Types.ObjectId.isValid(value)) {
        return res.status(400).json({ success: false, message: `Invalid ${paramName} format` });
    }

    next();
}

export const validateCreateOrder = (req, res, next) => {
    const rules = {
        productIds: 'required|array|min:1'
       
    };
    const messages = {
        required: 'Please enter :attribute',
        array: ':attribute must be an array',
        min: ':attribute must contain at least :min item'
        
    };

    const validation = new Validator(req.body || {}, rules, messages);

    if (validation.fails()) {
        return res.status(400).json({ success: false, message: getFirstError(validation) });
    }

    const invalidId = req.body.productIds.find((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidId) {
        return res.status(400).json({ success: false, message: `Invalid product ID: ${invalidId}` });
    }

    next();
}

export const validateUpdateOrder = (req, res, next) => {
    const body = req.body || {};


    if (!body.productIds) {
        return res.status(400).json({ success: false, message: 'productIds is required to update an order' });
    }

    if (!Array.isArray(body.productIds) || body.productIds.length === 0) {
        return res.status(400).json({ success: false, message: 'productIds must be a non-empty array' });
    }

    const invalidId = body.productIds.find((id) => !mongoose.Types.ObjectId.isValid(id));
    if (invalidId) {
        return res.status(400).json({ success: false, message: `Invalid product ID: ${invalidId}` });
    }

    next();
};
