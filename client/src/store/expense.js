import { createSlice } from '@reduxjs/toolkit';

const initialState = [
	{
		id: '0',
		name: 'LiHo',
		date: new Date(),
		amount: 3.5,
		label: [
			{
				type: 'primary',
				name: 'Bubble Tea',
			},
		],
	},
	{
		id: '1',
		date: new Date(2021, 5, 6),
		name: 'Shopee 6.6 purchase',
		amount: 750.5,
		label: [],
	},
	{
		id: '2',
		date: new Date(),
		name: 'Gas money',
		amount: 74.94,
		label: [{ type: 'warning', name: 'expenses' }],
	},
];
// const initialState = [];

const expenseSlice = createSlice({
	name: 'expense',
	initialState,
	reducers: {
		// ! To be handled by POST Request - for testing only
		addExpense(state, action) {
			const id = `${state.length}`;
			const { name, date: dateStr, amount } = action.payload;
			const date = new Date(dateStr);
			const newExpense = { name, date, amount };
			return [...state, newExpense];
		},
		deleteExpense(state, action) {
			const id = action.payload;
			const newState = state.filter((expense) => expense.id !== id);
			return newState;
		},
		updateExpense(state, action) {
			const { id, date: dateStr, name, amount, label } = action.payload;
			const date = new Date(dateStr);
			const updatedExpense = { id, date, name, amount, label };
			const newState = state.map((expense) =>
				expense.id === id ? updatedExpense : expense
			);
			return newState;
		},
		store(state) {
			// Requires date to be converted (see event.js)
		},
		clear(state) {
			return initialState;
		},
	},
});

export const expenseActions = expenseSlice.actions;

export default expenseSlice.reducer;
