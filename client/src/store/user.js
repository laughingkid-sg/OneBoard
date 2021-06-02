import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	id: '',
	firstName: '',
	lastName: '',
	email: '',
	boards: { boards: [], selectedBoard: '' },
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login(state, action) {
			state.id = action.payload.id;
			state.firstName = action.payload.firstName;
			state.lastName = action.payload.lastName;
			state.email = action.payload.email;
			state.boards = action.payload.boards;
			state.selectedBoard = action.payload.boards[0] || '';
		},
		logout(state) {
			return initialState;
		},
	},
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
