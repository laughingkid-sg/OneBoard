import { useDispatch } from 'react-redux';
import { Input, InputGroup } from 'reactstrap';
import { noteActions } from '../../store/note';

const EditNote = (props) => {
	const { isTitle, onCancel, data, noteId } = props;
	const dispatch = useDispatch();

	const cancelHandler = (e) => {
		const newData = e.target.value;
		if (newData === data) {
			onCancel();
			return;
		}

		// ! POST Request to make changes
		dispatch(noteActions.updateNotes({ isTitle, newData, noteId }));
		onCancel();
	};

	return (
		<InputGroup>
			<Input
				type={isTitle ? 'text' : 'textarea'}
				onBlur={cancelHandler}
				defaultValue={data}
				autoFocus
			/>
		</InputGroup>
	);
};

export default EditNote;
