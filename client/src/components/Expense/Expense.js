import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Card, CardTitle } from 'reactstrap';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';
import { expenseActions } from '../../store/expense';

function isStateEmpty(jsonObj) {
	let isEmpty = true;
	for (const key in jsonObj) {
		if (jsonObj[key].length !== 0) isEmpty = false;
	}
	return isEmpty;
}
function Expense(props) {
	const dispatch = useDispatch();

	// ! Needs more testing
	useEffect(() => {
		function expensesFromStorage() {
			const strExpenses = localStorage.getItem('expenses');
			const jsonExpenses = JSON.parse(strExpenses);
			if (!isStateEmpty(jsonExpenses)) {
				dispatch(expenseActions.replace(jsonExpenses));
			} else {
				// Fetch notes from server
				console.log('Fetch from server');
			}
		}

		expensesFromStorage();

		return () => {
			console.log('Unmount Expenses');
			dispatch(expenseActions.store());
		};
	}, []);

	return (
		<div className="row m-4">
			{console.log(props)}
			<div className="col-5">
				<Card className="row p-4">
					<CardTitle tag="h3">Add Expense </CardTitle>
					<AddExpense />
				</Card>
				<div>Track Expenses</div>
			</div>
			<div className="col-7">
				<Card className="p-4">
					<CardTitle tag="h3">Transaction History</CardTitle>
					<ExpenseList />
				</Card>
			</div>
		</div>
	);
}

export default Expense;
