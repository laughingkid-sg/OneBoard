import { configureStore } from '@reduxjs/toolkit';
import kanbanReducer from './kanban';
import userReducer from './user';
import noteReducer from './note';
import eventReducer from './event';
import expenseReducer from './expense';

const store = configureStore({
	reducer: {
		event: eventReducer,
		expense: expenseReducer,
		kanban: kanbanReducer,
		note: noteReducer,
		user: userReducer,
	},
});

export default store;
