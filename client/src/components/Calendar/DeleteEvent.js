import React, { useContext } from 'react';
import { Button, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch } from 'react-redux';
import EventModal from './EventModal';
import { eventActions } from '../../store/event';
import ModalContext from '../../store/ModalContext';

function DeleteEvent(props) {
	const { event } = props;
	const modalContext = useContext(ModalContext);
	const dispatch = useDispatch();

	const deleteHandler = () => {
		dispatch(eventActions.deleteEvent(event.id));
		modalContext.hideModal();
	};

	const cancelHandler = () => {
		modalContext.showModal(<EventModal modalType="Read" event={event} />);
	};

	return (
		<React.Fragment>
			<ModalBody>Are you sure you want to delete this event?</ModalBody>
			<ModalFooter>
				<Button color="danger" onClick={deleteHandler}>
					Delete Event
				</Button>
				<Button outline onClick={cancelHandler}>
					Go Back
				</Button>
			</ModalFooter>
		</React.Fragment>
	);
}

export default DeleteEvent;
