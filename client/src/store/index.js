import { configureStore } from '@reduxjs/toolkit';
import kanbanReducer from './kanban';
import userReducer from './user';

const store = configureStore({
	reducer: {
		kanban: kanbanReducer,
		user: userReducer,
	},
});

export default store;
