import { render, screen } from '@testing-library/react';
import ExpenseTable from './ExpenseTable';

describe('Expense Table Component', () => {
	test('renders blank table', () => {
		render(<ExpenseTable expenses={[]} />);

		const noExpenses = screen.getByText('No Expenses Found');
		expect(noExpenses).toBeInTheDocument;
	});

	// < 10 expenses on table - redux required
	// test('renders < 10 expenses', () => {
	// 	render(<ExpenseTable expenses={expenses} />);

	// 	const pagination = screen.getByTestId('pagination');
	// 	expect(pagination).not.toBeInTheDocument;
	// });

	// > 10 expenses on table
});
