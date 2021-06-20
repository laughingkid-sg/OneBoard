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
		},
		logout(state) {
			return initialState;
		},
		update(state, action) {
			const { firstName, lastName } = action.payload;
			return { ...state, firstName, lastName };
		},
		setBoards(state, action) {
			state.boards = action.payload;
		},
	},
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
