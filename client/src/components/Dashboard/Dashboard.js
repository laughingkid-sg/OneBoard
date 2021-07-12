import React from 'react';
import { Card } from 'reactstrap';
import Expense from '../Expense/Expense';
import Board from '../Kanban/Board';
import Notes from '../Notes/Notes';
import Calendar from '../Calendar/Calendar';
import Countdown from './Countdown/Countdown';
import styles from './Dashboard.module.css';
import ExpenseSummary from './ExpenseSummary/ExpenseSummary';

function Dashboard(props) {
	return (
		<div className="mt-4 mx-5">
			<div className="d-flex justify-content-around mb-5">
				<div className="col-3 d-flex flex-column justify-content-around">
					<Card style={{ height: '45%' }} className="shadow p-4">
						{/* Countdown goes here */}
						<h3> Countdown</h3>
						<Countdown />
					</Card>

					<Card style={{ height: '45%' }} className="shadow p-4">
						{/* Expense Summary goes here */}
						<h3>Expense Summary</h3>
						<ExpenseSummary />
					</Card>
				</div>
				<Card className="col-8 shadow p-4">
					<h3>Calendar</h3>
					<Calendar />
				</Card>
			</div>
			{/* Need to change the min height here */}
			<Card className="min-h-100 p-4 shadow row mb-5" id="notes">
				<h3>Notes</h3>
				<Notes />
			</Card>
			<Card className="row mb-5 shadow p-4" id="kanban">
				<h3>Kanban Board</h3>
				<Board />
			</Card>

			<Card className="mb-5 shadow p-4" id="expenses">
				<h3>Expenses</h3>
				<Expense />
			</Card>
		</div>
	);
}

export default Dashboard;
