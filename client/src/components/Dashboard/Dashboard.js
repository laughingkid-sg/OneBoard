import React from 'react';
import { Card } from 'reactstrap';
import Board from '../Kanban/Board';
import Notes from '../Notes/Notes';
import Calendar from '../Calendar/Calendar';
import styles from './Dashboard.module.css';

function Dashboard(props) {
	return (
		<div className="mt-4 mx-5">
			<div className="row mb-5">
				<Card className="min-h-100 p-4 shadow col-4">
					<Notes />
				</Card>
				<div className="col-3 d-flex flex-column justify-content-around">
					<Card style={{ height: '45%' }} className="shadow">
						Countdown goes here
					</Card>
					<Card style={{ height: '45%' }} className="shadow">
						Expense summary goes here
					</Card>
				</div>
				<Card className="col-5">
					<Calendar />
				</Card>
			</div>
			<Card className="row mb-5">
				<Board />
			</Card>
		</div>
	);
}

export default Dashboard;
