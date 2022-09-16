exports.userSignupValidator = (req, res, next) => {
	req.check("firstName", "Name is required").notEmpty()
	req.check("lastName", "Name is required").notEmpty()

	req
		.check("email", "Email must be between 6 to 128 characters")
		.matches(/.+\@.+\..+/)
		.withMessage("Email must contain @")
		.isLength({
			min: 5,
			max: 32,
		})
	req.check("password", "Password is required").notEmpty()
	req
		.check("password")
		.isLength({ min: 8 })
		.withMessage("Password must be between 8 and 32 characters")
		.matches(/^(?=.*[0-9])(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*]{8,32}$/)
		.withMessage("Password must contain at least 1 character and number.")
	const errors = req.validationErrors()
	if (errors) {
		const firstError = errors.map((error) => error.msg)[0]
		return res.status(400).json({
			message: firstError,
		})
	}
	next()
}
