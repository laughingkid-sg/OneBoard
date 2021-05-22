import React, { useState } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import Column from './Column';
import styles from './Board.module.css';
import initData from './init-data';

function Board() {
	const [tasks, setTasks] = useState(initData);

	const dragEndHandler = (result) => {
		const { source, destination, draggableId } = result;
		console.log(source, destination);

		if (!destination) {
			return;
		}

		// If the Draggable has no change in position
		if (
			source.droppableId === destination.droppableId &&
			source.index === destination.index
		) {
			return;
		}

		const start = tasks.columns[source.droppableId];
		const finish = tasks.columns[destination.droppableId];

		// Operation for same column
		if (start === finish) {
			const newTasks = [...start.taskIds];
			newTasks.splice(source.index, 1);
			newTasks.splice(destination.index, 0, draggableId);

			const newCol = {
				...start,
				taskIds: newTasks,
			};

			setTasks({
				...tasks,
				columns: { ...tasks.columns, [newCol.id]: newCol },
			});
			return;
		}

		// Operation for different column
		const startTaskIds = [...start.taskIds];
		startTaskIds.splice(source.index, 1);
		const newStart = {
			...start,
			taskIds: startTaskIds,
		};

		const finTaskIds = [...finish.taskIds];
		finTaskIds.splice(destination.index, 0, draggableId);
		const newFin = {
			...finish,
			taskIds: finTaskIds,
		};
		console.log(newFin)

		setTasks({
			...tasks,
			columns: {
				...tasks.columns,
				[newStart.id]: newStart,
				[newFin.id]: newFin,
			},
		});
		console.log(tasks);
		return;
	};

	const renderCols = tasks.columnOrder.map((colId) => {
		const column = tasks.columns[colId];
		const tasksInCol = column.taskIds.map((taskId) => tasks.tasks[taskId]);
		return (
			<Column
				key={column.id}
				column={column}
				tasks={tasksInCol}
				title={column.title}
			/>
		);
	});

	return (
		<DragDropContext onDragEnd={dragEndHandler}>
			<div className={styles.board}>{renderCols}</div>
		</DragDropContext>
	);
}

export default Board;
