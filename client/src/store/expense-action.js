import { expenseActions } from './expense';
import {
	deleteRequest,
	getRequest,
	postRequest,
	putRequest,
	determineURL,
	formatQueryString,
} from '../lib/fetch';
import { createExpense } from '../lib/expense';
import { createLabels } from '../lib/kanban';

const URL_HEADER = 'api/expense';

// function determineURL(id) {
// 	return `${URL_HEADER}/${id}`;
// }

// function formatQueryString(start, end) {
// 	return `${URL_HEADER}?start=${start}&end=${end}`;
// }

export const fetchExpenses = (token, start, end) => {
	const formatStart = start.toISOString();
	const formatEnd = end.toISOString();
	return async (dispatch) => {
		try {
			const expenseRes = await getRequest(
				token,
				formatQueryString(URL_HEADER, formatStart, formatEnd)
			);

			const expenses = expenseRes.map((event) => createExpense(event));

			dispatch(expenseActions.replace({ type: 'expenses', expenses }));
			return expenses;
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
				determineURL(URL_HEADER, expense._id),
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
			await deleteRequest(token, determineURL(URL_HEADER, id));
			dispatch(expenseActions.deleteExpense(id));
		} catch (error) {}
	};
};

export const updateLabels = (token, dataReq) => {
	return async (dispatch) => {
		try {
			const labels = await putRequest(token, URL_HEADER, dataReq);
			const formatLabels = createLabels(labels);
			dispatch(
				expenseActions.replace({ type: 'labels', labels: formatLabels })
			);
		} catch (error) {}
	};
};
