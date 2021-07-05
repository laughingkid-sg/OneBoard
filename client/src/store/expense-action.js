import { expenseActions } from './expense';
import {
	deleteRequest,
	getRequest,
	postRequest,
	putRequest,
} from '../lib/fetch';
import { createExpense, sortByDate } from '../lib/expense';

const URL_HEADER = 'api/expense';

function determineURL(id) {
	return `${URL_HEADER}/${id}`;
}

function formatQueryString(start, end) {
	return `${URL_HEADER}?start=${start}&end=${end}`;
}

export const fetchExpenses = (token, start, end) => {
	const formatStart = start.toISOString();
	const formatEnd = end.toISOString();
	return async (dispatch) => {
		try {
			const expenseRes = await getRequest(
				token,
				formatQueryString(formatStart, formatEnd)
			);

			const expenses = expenseRes
				.map((event) => createExpense(event))
				.sort(sortByDate);
			dispatch(expenseActions.replace({ type: 'expenses', expenses }));
		} catch (error) {}
	};
};

export const addExpense = (token, dataReq) => {
	return async (dispatch) => {
		try {
			const response = await postRequest(token, URL_HEADER, dataReq);

			const expense = createExpense(response);
			dispatch(expenseActions.addExpense(expense));
		} catch (error) {}
	};
};

export const updateExpense = (token, expense) => {
	return async (dispatch) => {
		try {
			const response = await putRequest(
				token,
				determineURL(expense._id),
				expense
			);
			const formatEvent = createExpense(response);
			dispatch(expenseActions.updateExpense(formatEvent));
		} catch (error) {}
	};
};

export const deleteExpense = (token, id) => {
	return async (dispatch) => {
		try {
			await deleteRequest(token, determineURL(id));
			dispatch(expenseActions.deleteExpense(id));
		} catch (error) {}
	};
};

// export const fetchExpense = (token) => {

// }
