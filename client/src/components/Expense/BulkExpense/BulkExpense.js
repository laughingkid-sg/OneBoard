import React, { useContext, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { Button, Input } from 'reactstrap';
import { AiOutlineClose } from 'react-icons/ai';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import ModalContext from '../../../store/ModalContext';
import styles from '../DeleteExpense.module.css';
import { bulkAddExpense } from '../../../store/expense-action';

function BulkExpense() {
	const dispatch = useDispatch();
	const [cookies] = useCookies(['t']);
	const { t: token } = cookies;
	const modalContext = useContext(ModalContext);
	const [fileToUpload, setFileToUpload] = useState(null);

	const importExpensesHandler = () => {
		if (!fileToUpload) return; // Set error message
		dispatch(bulkAddExpense(token, fileToUpload));
	};

	const fileChangeHandler = (e) => {
		const file = e.target.files[0];
		console.log(file);
		setFileToUpload(file);
		// const fileReader = new FileReader();
		// fileReader.onloadend = (fr) => {
		// 	const content = fileReader.result;
		// 	const lines = content.split('\r\n');
		// 	console.log(content);
		// 	for (let i = 1; i < lines.length; i++) {
		// 		const lineContent = lines[i].trim();
		// 		const lineSplit = lineContent.split(',');
		// 		// Date conversion goes here
		// 		lineSplit[2] = new Date().toISOString();
		// 		lines[i] = lineSplit.join(',');
		// 	}
		// 	console.log(lines);
		// };
		// fileReader.readAsText(file);
	};

	return (
		<Modal isOpen={modalContext.isVisible} toggle={modalContext.hideModal}>
			{console.log(fileToUpload)}
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader>Import from csv</ModalHeader>
			<ModalBody>
				<p>
					Please ensure that the columns are in the following order:
					Name,Description,Date,Amount
				</p>
				<Input type="file" accept="csv" onChange={fileChangeHandler} />
			</ModalBody>
			<ModalFooter>
				<Button color="success" onClick={importExpensesHandler}>
					Import Expenses
				</Button>
				<Button onClick={modalContext.hideModal}>Cancel</Button>
			</ModalFooter>
		</Modal>
	);
}

export default BulkExpense;
