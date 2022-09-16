import { useReducer } from 'react';

const ACTIONS = {
	INPUT: 'INPUT',
	BLUR: 'BLUR',
	RESET: 'RESET',
};

const deafultState = {
	value: '',
	isTouched: false,
};

const inputStateReducer = (state, action) => {
	switch (action.type) {
		case ACTIONS.INPUT:
			return { ...state, value: action.value };

		case ACTIONS.BLUR:
			return { ...state, isTouched: true };

		case ACTIONS.RESET:
			return deafultState;
		default:
			return;
	}
};

export default function useInput(validate, initValue = '') {
	let initState = deafultState;

	if (initValue) {
		initState = { value: initValue, isTouched: false };
	}

	const [inputState, dispatchInput] = useReducer(
		inputStateReducer,
		initState
	);

	const isValid = validate(inputState.value);
	const hasError = !isValid && inputState.isTouched;

	const inputChangeHandler = (e) => {
		dispatchInput({ type: ACTIONS.INPUT, value: e.target.value });
	};

	const inputBlurHandler = (e) => {
		dispatchInput({ type: ACTIONS.BLUR });
	};

	const inputResetHandler = (e) => {
		dispatchInput({ type: ACTIONS.RESET });
	};

	return {
		value: inputState.value,
		isValid,
		hasError,
		onChange: inputChangeHandler,
		onBlur: inputBlurHandler,
		reset: inputResetHandler,
	};
}
