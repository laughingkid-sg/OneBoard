import { configureStore } from '@reduxjs/toolkit';
import kanbanReducer from './kanban';

const store = configureStore({
    reducer: {
        kanban: kanbanReducer,
    }
})

export default store;