const defaultIsEmpty = (value) => {
    if (value === undefined || value === null) {
        return true;
    }

    if (typeof value === 'string') {
        return value.trim() === '';
    }

    return false;
};

exports.validateBody = (requiredFields, options = {}) => {
    if (!Array.isArray(requiredFields)) {
        throw new TypeError('requiredFields must be an array of field names');
    }

    const { isEmpty = defaultIsEmpty } = options;

    return (req, res, next) => {
        const missingFields = requiredFields.filter((field) => {
            const value = req.body?.[field];
            return isEmpty(value);
        });

        if (missingFields.length) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(', ')}`,
            });
        }

        next();
    };
};
