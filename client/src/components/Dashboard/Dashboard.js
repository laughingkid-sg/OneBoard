import React from 'react';
import Board from '../Kanban/Board';
import Notes from '../Notes/Notes';
import Calendar from '../Calendar/Calendar';
import styles from './Dashboard.module.css';

function Dashboard(props) {
	return (
		<div className={styles.container}>
			<div className={styles.topRow}>
				<Card title="Notes">
					<Notes />
				</Card>
				<Card title="Total Expenses">
					<p className={styles.subtitle}>for May 2021</p>
					<p className={styles.expenses}>$21.00</p>
				</Card>
				<Card title="Schedule">
					<Calendar />
				</Card>
			</div>
			<div className={styles.bottomRow}>
				<Board />
			</div>
		</div>
	);
}

// Soon to be deleted
const Card = (props) => {
	return (
		<div className={styles.placeholder}>
			<h3 className={styles.title}>{props.title}</h3>
			{props.children}
		</div>
	);
};

export default Dashboard;
