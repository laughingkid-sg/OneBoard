import { useDispatch } from 'react-redux';
import { Table } from 'reactstrap';
import { expenseActions } from '../../store/expense';
import ExpenseItem from './ExpenseItem';

const ExpenseTable = (props) => {
	const { expenses } = props;
	const dispatch = useDispatch();

	const deleteHandler = (key) => {
		dispatch(expenseActions.deleteExpense(key));
	};

	const renderExpenses = expenses.map((expense) => (
		<ExpenseItem expense={expense} />
	));

	return (
		<Table striped>
			<thead>
				<tr>
					<th>Date</th>
					<th>Name</th>
					<th>Amount ($)</th>
					<th>Edit/Delete</th>
				</tr>
			</thead>
			<tbody>{renderExpenses}</tbody>
		</Table>
	);
};

export default ExpenseTable;
