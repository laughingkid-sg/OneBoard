import React from 'react';
import { Table, Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import ExpenseItem from './ExpenseItem';

const ExpenseTable = (props) => {
	const { expenses } = props;
	const [currentPage, setCurrentPage] = useState(0);
	const pageSize = 10;
	const pageCount = Math.ceil(expenses.length / pageSize);

	const expensesToRender = expenses.slice(
		currentPage * pageSize,
		(currentPage + 1) * pageSize
	);

	const renderPages = [...Array(pageCount)].map((page, index) => {
		<PaginationItem active={index === currentPage} key={index}>
			<PaginationLink onClick={(e) => goToHandler(e, index)}>
				{i + 1}
			</PaginationLink>
		</PaginationItem>;
	});

	return (
		<React.Fragment>
			<Table striped>
				<thead>
					<tr key="header">
						<th>Date</th>
						<th>Name</th>
						<th>Description</th>
						<th>Amount ($)</th>
						<th>Edit/Delete</th>
					</tr>
				</thead>
				{expenses.length > 0 && (
					<tbody>
						{expensesToRender.map((expense) => (
							<ExpenseItem expense={expense} key={expense._id} />
						))}
					</tbody>
				)}
			</Table>
			{/* To test */}
			{expenses.length !== 0 && (
				<Pagination>
					<PaginationItem disabled={currentPage === 0}>
						<PaginationLink
							onClick={() => {
								setCurrentPage(currentPage + 1);
							}}
						/>
					</PaginationItem>
					{renderPages}
					<PaginationItem disabled={currentPage === pageCount - 1}>
						<PaginationLink
							onClick={() => {
								setCurrentPage(currentPage - 1);
							}}
						/>
					</PaginationItem>
				</Pagination>
			)}
			{expenses.length === 0 && (
				<h4 className="text-center">No Expenses Found</h4>
			)}
		</React.Fragment>
	);
};

export default ExpenseTable;
