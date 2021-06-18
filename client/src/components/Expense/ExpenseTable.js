import React from 'react';
import { Table } from 'reactstrap';
import ExpenseItem from './ExpenseItem';

const ExpenseTable = (props) => {
	const { expenses } = props;

	const renderExpenses = expenses.map((expense) => (
		<ExpenseItem expense={expense} />
	));

	return (
		// TODO Make scrollable after 13 (TBC) transactions
		<React.Fragment>
			<Table striped>
				<thead>
					<tr key="header">
						<th>Date</th>
						<th>Name</th>
						<th>Amount ($)</th>
						<th>Edit/Delete</th>
					</tr>
				</thead>
				{renderExpenses.length > 0 && <tbody>{renderExpenses}</tbody>}
			</Table>
			{renderExpenses.length === 0 && (
				<h4 className="text-center">No Expenses Found</h4>
			)}
		</React.Fragment>
	);
};

export default ExpenseTable;
