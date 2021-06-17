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
			const newBoards = {
				boards: action.payload.boards,
				selectedBoard: action.payload.boards[0] || '',
			};
			state.boards = newBoards;
		},
		logout(state) {
			return initialState;
		},
		update(state, action) {
			const { firstName, lastName } = action.payload;
			return { ...state, firstName, lastName };
		},
	},
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
