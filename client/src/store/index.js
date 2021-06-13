import { configureStore } from '@reduxjs/toolkit';
import kanbanReducer from './kanban';
import userReducer from './user';
import noteReducer from './note';
import eventReducer from './event';

const store = configureStore({
	reducer: {
		event: eventReducer,
		kanban: kanbanReducer,
		note: noteReducer,
		user: userReducer,
	},
});

export default store;
