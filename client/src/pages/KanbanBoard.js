import React from 'react';
import MainLayout from '../Layout/MainLayout';
import Board from '../components/Kanban/Board';
import styles from './pages.module.css';

function KanbanBoard() {
	return (
		<MainLayout>
			<div className={styles.kanban}>
				<Board />
			</div>
		</MainLayout>
	);
}

export default KanbanBoard;
