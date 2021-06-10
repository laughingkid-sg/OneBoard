import { useContext } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { AiOutlineClose } from 'react-icons/ai';
import ModalContext from '../../store/ModalContext';
import styles from './DeleteNote.module.css';

const DeleteNote = (props) => {
	const { note } = props;
	const modalContext = useContext(ModalContext);

	const deleteHandler = () => {
		console.log('Delete Task');
	};

	return (
		<Modal isOpen={modalContext.isVisible} toggle={modalContext.hideModal}>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader>Delete Note</ModalHeader>
			<ModalBody>Are you sure you want to delete {note.title}?</ModalBody>
			<ModalFooter>
				<Button color="danger" onClick={deleteHandler}>
					Delete Task
				</Button>
				<Button onClick={modalContext.hideModal}>Cancel</Button>
			</ModalFooter>
		</Modal>
	);
};

export default DeleteNote;
