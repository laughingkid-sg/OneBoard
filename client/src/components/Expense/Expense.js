import React from 'react';
import AddExpense from './AddExpense';
import ExpenseList from './ExpenseList';

function Expense() {
	return (
		<React.Fragment>
			<AddExpense />
			<ExpenseList />
		</React.Fragment>
	);
}

export default Expense;
