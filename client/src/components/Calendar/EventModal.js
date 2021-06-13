import React, { useContext } from 'react';
import { Modal, ModalHeader } from 'reactstrap';
import { AiOutlineClose } from 'react-icons/ai';
import DeleteEvent from './DeleteEvent';
import EditEvent from './EditEvent';
import ModalContext from '../../store/ModalContext';
import styles from './EventModal.module.css';
import ViewEvent from './ViewEvent';

function EventModal(props) {
	const { modalType, event } = props;
	const modalContext = useContext(ModalContext);

	const renderContent = () => {
		switch (modalType) {
			case 'Read':
				return <ViewEvent event={event} />;
			case 'Add':
				return <EditEvent addStart={props.addStart} />;
			case 'Edit':
				return <EditEvent event={event} />;
			case 'Delete':
				return <DeleteEvent event={event} />;
			default:
				return 'Error!';
		}
	};

	const renderHeader =
		modalType === 'Read' ? event.title : `${modalType} Event`;
	return (
		<Modal
			isOpen={modalContext.isVisible}
			toggle={modalContext.hideModal}
			className="my-1"
		>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader>{renderHeader}</ModalHeader>
			{renderContent()}
		</Modal>
	);
}

export default EventModal;
