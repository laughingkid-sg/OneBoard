import React from 'react';
import Board from '../Kanban/Board';
import Notes from '../Notes/Notes';
import styles from './Dashboard.module.css';

const DUMMY_SCHEDULE = [
	{ time: '9am', activity: 'CS2100 Tutorial' },
	{ time: '10am', activity: '' },
	{ time: '10:30am', activity: 'Gym' },
	{ time: '11am', activity: '' },
	{ time: '12pm', activity: '' },
	{ time: '1pm', activity: 'CS2100 Lecture' },
	{ time: '3pm', activity: '' },
];

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
					<div style={{ overflow: 'auto', height: '75%' }}>
						<ul className={styles.scheduleList}>
							{DUMMY_SCHEDULE.map((event) => (
								<ScheduleListItem
									time={event.time}
									activity={event.activity}
								/>
							))}
						</ul>
					</div>
				</Card>
			</div>
			<div className={styles.bottomRow}>
				<Board />
			</div>
		</div>
	);
}

const Card = (props) => {
	return (
		<div className={styles.placeholder}>
			<h3 className={styles.title}>{props.title}</h3>
			{props.children}
		</div>
	);
};

const ScheduleListItem = (props) => {
	return (
		<li className={styles.scheduleItem}>
			<span>{props.time}</span>
			<span className={styles.activity}>{props.activity}</span>
		</li>
	);
};
export default Dashboard;
