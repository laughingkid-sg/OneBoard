import { createSlice } from '@reduxjs/toolkit';

const initState = {
	id: '',
	name: '',
	labels: [],
	columns: [
		{
			id: '',
			name: '',
			order: -1,
			tasks: [
				{
					id: '',
					name: '',
					description: '',
					subtask: [],
					label: '', // Blanked for now
				},
			],
		},
	],
};

const kanbanSlice = createSlice({
	name: 'kanban',
	initialState: initState,
	reducers: {
		replace(state, action) {
			return action.payload;
		},
		clear(state) {
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
		store(state) {
			localStorage.setItem('currentBoard', JSON.stringify(state));
		},
	},
});

export const kanbanActions = kanbanSlice.actions;

export default kanbanSlice.reducer;
