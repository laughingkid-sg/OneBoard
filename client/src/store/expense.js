import { createSlice } from '@reduxjs/toolkit';

const initialState = { expense: [], labels: [] };

function sortExpenses(expA, expB) {
	return expA.date.valueOf() - expB.date.valueOf();
}

const expenseSlice = createSlice({
	name: 'expense',
	initialState,
	reducers: {
		addExpense(state, action) {
			const expense = action.payload;
			state.expense.push(expense);
		},
		deleteExpense(state, action) {
			const id = action.payload;
			const newExpenses = state.expense.filter(
				(expense) => expense._id !== id
			);
			return { expense: newExpenses, labels: state.labels };
		},
		updateExpense(state, action) {
			// const { id, date: dateStr, name, amount, label } = action.payload;
			// const date = new Date(dateStr);
			// const updatedExpense = { id, date, name, amount, label };
			// const newState = state.expense
			// 	.map((expense) =>
			// 		expense.id === id ? updatedExpense : expense
			// 	)
			// 	.sort(sortExpenses);
			// return { expense: newState, labels: state.labels };
			const newExpense = action.payload;
			state.expense = state.expense.map((expense) =>
				expense._id === newExpense._id ? newExpense : expense
			);
		},
		replace(state, action) {
			const { type, expenses, labels } = action.payload;
			switch (type) {
				case 'expenses':
					state.expense = expenses;
					return;
				case 'labels':
					state.labels = labels;
					return;
				default:
					return { expense: expenses, labels };
			}
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
