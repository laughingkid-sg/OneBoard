import React, { useContext } from 'react';
import { Button, ModalBody, ModalFooter } from 'reactstrap';
import { useDispatch } from 'react-redux';
import EventModal from './EventModal';
import ModalContext from '../../store/ModalContext';
import { deleteEvent } from '../../store/event-actions';

function DeleteEvent(props) {
	const { event } = props;
	const modalContext = useContext(ModalContext);
	const dispatch = useDispatch();

	const deleteHandler = () => {
		// ! Action creator
		dispatch(deleteEvent(event._id));
		// dispatch(eventActions.deleteEvent(event._id));
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
