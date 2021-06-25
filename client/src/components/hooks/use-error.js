import { useState, useEffect } from 'react';

export default function useError() {
	const [error, setError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	useEffect(() => {
		if (!errorMsg) setError(false);
		else setError(true);
		return () => {};
	}, [errorMsg]);

	useEffect(() => {
		let timer;
		if (error) {
			timer = setTimeout(() => {
				changeMessage('');
			}, 5000);
		}

		return () => {
			clearTimeout(timer);
		};
	}, [error]);

	const changeError = (boolean) => {
		setError(boolean);
	};

	const changeMessage = (message) => {
		setErrorMsg(message);
	};

	return {
		error,
		errorMsg,
		changeError,
		changeMessage,
	};
}
