const EMAIL_FORMAT =
	/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export const isEmail = (value) => EMAIL_FORMAT.test(value);

export const textNotEmpty = (value) => value.trim() !== '';
