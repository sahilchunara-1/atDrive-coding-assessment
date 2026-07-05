import Validator from 'validatorjs';

const getFirstError = (validation) => {
    const allErrors = validation.errors.all();
    const firstField = Object.keys(allErrors)[0];
    return allErrors[firstField][0];
};

export const validateWeather = (req, res, next) => {
    const rules = {
        lat: 'required|numeric|min:-90|max:90',
        lon: 'required|numeric|min:-180|max:180',
    };

    const messages = {
        required: 'Please provide :attribute',
        numeric: ':attribute must be a number',
        min: ':attribute is out of valid range',
        max: ':attribute is out of valid range',
    };

    const validation = new Validator(req.query || {}, rules, messages);

    if (validation.fails()) {
        return res.status(400).json({ success: false, message: getFirstError(validation) });
    }

    next();
};