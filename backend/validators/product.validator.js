import Validator from 'validatorjs';
import mongoose from 'mongoose';

const getFirstError = (validation) => {
    const allErrors = validation.errors.all();
    const firstField = Object.keys(allErrors)[0];
    return allErrors[firstField][0];
};

export const validateObjectId = (paramName = 'id') => (req, res, next) => {
    const value = req.params[paramName];

    if (!value) {
        return res.status(400).json({ success: false, message: `${paramName} is required` });
    }

    if (!mongoose.Types.ObjectId.isValid(value)) {
        return res.status(400).json({ success: false, message: `Invalid ${paramName} format` });
    }

    next();
};

export const validateAddProduct = (req, res, next) => {
    const rules = {
        name: 'required|string|min:3|max:100',
        price: 'required|numeric|min:1',
        description: 'required|string|min:10|max:255',
    };

    const messages = {
        required: 'Please enter :attribute of the product',
        numeric: ':attribute must be a number',
        'min.string': ':attribute must be at least :min characters long',
        'max.string': ':attribute cannot exceed :max characters',
        'min.numeric': ':attribute cannot be negative',
    };

    const validation = new Validator(req.body || {}, rules, messages);

    if (validation.fails()) {
        return res.status(400).json({
            success: false,
            message: getFirstError(validation),
        });
    }

    next();
};

export const validateUpdateProduct = (req, res, next) => {
    const body = req.body || {};

    if (Object.keys(body).length === 0) {
        return res.status(400).json({ success: false, message: 'At least one field is required to update' });
    }

    const rules = {
        name: 'string|min:3|max:100',
        price: 'numeric|min:0',
        description: 'string|min:10|max:255',
    };

    const validation = new Validator(body, rules);

    if (validation.fails()) {
        return res.status(400).json({
            success: false,
            message: getFirstError(validation),
        });
    }

    next();
};