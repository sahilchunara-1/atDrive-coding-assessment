import Validator from 'validatorjs';

const getFirstError = (validation) => {
    const allErrors = validation.errors.all();
    const firstField = Object.keys(allErrors)[0];
    return allErrors[firstField][0];
};

export const validateRegister = (req, res, next) => {
    const rules = {
        username: 'required|string|min:3|max:50',
        password: 'required|string|min:6',
    };

    const messages = {
        required: 'Please enter :attribute',
        min: ':attribute is too short :min characters required',
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

export const validateLogin = (req, res, next) => {
    const rules = {
        username: 'required|string',
        password: 'required|string',
    };

    const messages = {
        required: 'Please enter :attribute',
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