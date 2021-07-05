const EMAIL_FORMAT =
	/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const isEmail = (value) => EMAIL_FORMAT.test(value);

export const textNotEmpty = (value) => value.trim() !== '';

export const isNumeric = (value) => {
	if (typeof value !== 'string') return false;
	return !(isNaN(value) || isNaN(parseFloat(value)));
};
