import { createSlice } from '@reduxjs/toolkit';

const initialState = { expense: [], labels: [] };

function sortExpenses(expA, expB) {
	return expA.date.valueOf() - expB.date.valueOf();
}

const expenseSlice = createSlice({
	name: 'expense',
	initialState,
	reducers: {
		// ! To be handled by POST Request - for testing only
		addExpense(state, action) {
			const id = `${state.expense.length}`;
			const { name, date: dateStr, amount } = action.payload;
			const date = new Date(dateStr);
			const newExpense = { id, name, date, amount };
			const newState = [...state.expense, newExpense].sort(sortExpenses);
			return { expense: newState, labels: state.labels };
		},
		deleteExpense(state, action) {
			const id = action.payload;
			const newState = state.expense.filter(
				(expense) => expense.id !== id
			);
			return { expense: newState, labels: state.labels };
		},
		updateExpense(state, action) {
			const { id, date: dateStr, name, amount, label } = action.payload;
			const date = new Date(dateStr);
			const updatedExpense = { id, date, name, amount, label };
			const newState = state.expense
				.map((expense) =>
					expense.id === id ? updatedExpense : expense
				)
				.sort(sortExpenses);
			return { expense: newState, labels: state.labels };
		},
		replace(state, action) {
			const { expense, labels } = action.payload;
			const replaceExpense = expense.map((expense) => {
				const date = new Date(expense.date);
				return { ...expense, date };
			});
			return { expense: replaceExpense, labels };
		},
		store(state) {
			// Requires date to be converted (see event.js)
			const storeExpense = state.expense.map((expense) => {
				const date = expense.date.valueOf();
				return { ...expense, date };
			});
			const storeState = { expenses: storeExpense, labels: state.labels };
			localStorage.setItem('expenses', JSON.stringify(storeState));
		},
		clear(state) {
			return initialState;
		},
	},
});

export const expenseActions = expenseSlice.actions;

export default expenseSlice.reducer;
