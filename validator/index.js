exports.userSignupValidator = (req, res, next) => {
    req.check('firstName', 'Name is required').notEmpty()
    req.check('lastName', 'Name is required').notEmpty()
    
    req.check('email', 'Email must be between 6 to 128 characters')
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 5,
            max: 32
        });
        req.check('password', 'Password is required').notEmpty();
        req.check('password')
            .isLength({ min: 8 })
            .withMessage('Password must contain at least 8 characters')
            .matches(/\d/)
            .withMessage('Password must contain a number');
        const errors = req.validationErrors();
        if (errors) {
            const firstError = errors.map(error => error.msg)[0];
            return res.status(400).json({ 
                errorCode: 7,
                message: firstError 
            });
        }
        next();
}