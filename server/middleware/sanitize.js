// Removes MongoDB operator keys ($...) and dotted keys from user input.
// Mutates in place, so it works with Express 5's read-only req.query.
const clean = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    for (const key of Object.keys(obj)) {
        if (key.startsWith('$') || key.includes('.')) {
            delete obj[key];
        } else {
            clean(obj[key]);
        }
    }
    return obj;
};

module.exports = (req, res, next) => {
    clean(req.body);
    clean(req.params);
    next();
};