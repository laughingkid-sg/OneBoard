import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	id: '',
	token: '',
	isLoggedIn: false,
	firstName: '',
	lastName: '',
	email: '',
	boards: [],
};

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		login(state, action) {
			state.id = action.payload.id;
			state.token = action.payload.token;
			state.firstName = action.payload.firstName;
			state.lastName = action.payload.lastName;
			state.email = action.payload.email;
			state.boards = action.payload.boards;
			state.isLoggedIn = true;
		},
		logout(state) {
			state.id = '';
			state.token = '';
			state.isLoggedIn = false;
			state.firstName = '';
			state.lastName = '';
			state.email = '';
			state.boards = [];
		},
	},
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
