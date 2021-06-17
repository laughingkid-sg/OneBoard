import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';
import { Badge, Table } from 'reactstrap';
import EditDelete from '../Kanban/KanbanUI/EditDelete';
import { expenseActions } from '../../store/expense';

const ExpenseTable = (props) => {
	const { expenses } = props;
	const dispatch = useDispatch();

	const deleteHandler = (key) => {
		dispatch(expenseActions.deleteExpense(key));
	};

	const renderExpenses = expenses.map((expense) => (
		<tr key={expense.id}>
			<td>{moment(expense.date).format('D/M/YYYY')}</td>
			<td>
				{expense.name}
				{expense.label && <ExpenseBadges labels={expense.label} />}
			</td>
			<td>{expense.amount.toFixed(2)}</td>
			<td>
				{/* CSS change needed */}
				<EditDelete
					onEdit={() => alert('Edit')}
					onDelete={() => deleteHandler(expense.id)}
				/>
			</td>
		</tr>
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

const ExpenseBadges = (props) => {
	const { labels } = props;

	return labels.map((label) => (
		<Badge className={`bg-${label.type}`}>{label.name}</Badge>
	));
};

export default ExpenseTable;
