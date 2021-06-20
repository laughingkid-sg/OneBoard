import { createSlice } from '@reduxjs/toolkit';

const initState = {
	tasks: {},
	columns: {},
	columnOrder: [],
	labels: {
		primary: '',
		secondary: '',
		success: '',
		info: '',
		warning: '',
		danger: '',
	},
};

const kanbanSlice = createSlice({
	name: 'kanban',
	initialState: initState,
	reducers: {
		replaceBoard(state, action) {
			state.tasks = action.payload.tasks;
			state.columns = action.payload.columns;
			state.columnOrder = action.payload.columnOrder;
		},
		resetBoard(state) {
			return initState;
		},
		editTask(state, action) {
			const taskId = action.payload.id;
			state.tasks = { ...state.tasks, [taskId]: { ...action.payload } };
		},
		addSubtask(state, action) {
			const { taskId, subtask } = action.payload;
			const task = state.tasks[taskId];
			const { subtasks } = task;
			const newSubtasks = subtasks.push(subtask);
			state.tasks = {
				...state.tasks,
				[taskId]: { ...task, subtasks: newSubtasks },
			};
		},
		updateSubTask(state, action) {
			const { taskId, newSubtask } = action.payload;
			const task = state.tasks[taskId];
			const newSubtasks = task.subtask.map((subtask) =>
				subtask.id === newSubtask.id ? newSubtask : subtask
			);
			state.tasks = {
				...state.tasks,
				[taskId]: { ...task, subtasks: newSubtasks },
			};
		},
		editColumn(state, action) {
			const { colId, columnName } = action.payload;

			const newColumn = { ...state.columns[colId] };
			newColumn.title = columnName;
			state.columns = { ...state.columns, [colId]: newColumn };
		},
		storeBoard(state) {
			localStorage.setItem('currentBoard', JSON.stringify(state));
		},
	},
});

export const kanbanActions = kanbanSlice.actions;

export default kanbanSlice.reducer;
