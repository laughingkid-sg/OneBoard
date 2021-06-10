import { createSlice } from '@reduxjs/toolkit';

// State will be a dictionary of Notes
const initialState = {};

const noteSlice = createSlice({
	name: 'note',
	initialState,
	reducers: {
		replaceNotes(state, action) {
			console.log('Replace Notes called');
			state = [...action.payload];
		},
		updateNotes(state, action) {
			console.log('Update Notes called');
		},
		clear(state) {
			return initialState;
		},
	},
});

export const noteActions = noteSlice.actions;

export default noteSlice.reducer;
