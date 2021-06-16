import React, { useEffect, useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AiOutlinePlus, AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import AddNote from './AddNote';
import DeleteNote from './DeleteNote';
import SearchNote from './SearchNote';
import EditNote from './EditNote';
import ModalContext from '../../store/ModalContext';
import { noteActions } from '../../store/note';

function Notes() {
	// TODO Persistence
	const dispatch = useDispatch();
	const noteStore = useSelector((state) => state.note);
	const { isEmpty, keys, notes } = noteStore;
	const [index, setIndex] = useState(0);
	const [key, setKey] = useState(keys[index]);
	const [isAdd, setIsAdd] = useState(false);
	const [isEdit, setIsEdit] = useState({ title: false, description: false });
	const modalContext = useContext(ModalContext);

	useEffect(() => {
		function notesFromStorage() {
			const strNotes = localStorage.getItem('notes');
			const jsonNotes = JSON.parse(strNotes);
			if (jsonNotes) {
				console.log('Mount notes from storage');
				dispatch(noteActions.replaceNotes(jsonNotes));
			} else {
				// Fetch notes from server
				console.log('Fetch from server');
			}
		}

		notesFromStorage();

		return () => {
			console.log('Unmount Notes');
			dispatch(noteActions.store());
		};
	}, [dispatch]);

	useEffect(() => {
		setKey(keys[index]);
	}, [keys, index]);

	const nextHandler = () => {
		if (isEmpty) return;
		if (index === keys.length - 1) return;
		setIndex(index + 1);
	};

	const previousHandler = () => {
		if (isEmpty) return;
		if (index === 0) return;
		setIndex(index - 1);
	};

	const deleteHandler = () => {
		if (isEmpty) return;
		modalContext.showModal(<DeleteNote note={notes[key]} />);
	};

	const addHandler = () => {
		// Ensures that the user is not editing before adding new task
		for (const key in isEdit) {
			if (isEdit[key]) return;
		}

		setIsAdd(true);
	};

	const searchHandler = () => {
		if (isEmpty) return;
		modalContext.showModal(<SearchNote goTo={goToHandler} />);
	};

	const goToHandler = (key) => {
		const selectedIndex = keys.indexOf(key);
		setIndex(selectedIndex);
		modalContext.hideModal();
	};

	const titleToggleHandler = () => {
		setIsEdit({ ...isEdit, title: !isEdit.title });
	};

	const descriptionToggleHandler = () => {
		setIsEdit({ ...isEdit, description: !isEdit.description });
	};

	const makeEditNote = (isTitle) => (
		<EditNote
			noteId={key}
			onCancel={isTitle ? titleToggleHandler : descriptionToggleHandler}
			data={isTitle ? notes[key].title : notes[key].description}
			isTitle={isTitle}
		/>
	);

	// If user is adding Note, return AddNote Component instead
	if (isAdd) {
		return (
			<AddNote
				onCancel={() => {
					setIsAdd(false);
				}}
			/>
		);
	}

	return (
		<div className="d-flex flex-column justify-content-between">
			<div>
				{keys.length === 0 ? (
					<p>No notes. Create one by pressing the "+" icon below</p>
				) : (
					<NoteContent
						titleChange={titleToggleHandler}
						descriptionChange={descriptionToggleHandler}
						title={notes[key] ? notes[key].title : ''}
						description={notes[key] ? notes[key].description : ''}
						isEdit={isEdit}
						onEdit={makeEditNote}
					/>
				)}
			</div>
			<div style={{ fontSize: '1.75rem', cursor: 'pointer' }}>
				<FaCaretLeft
					onClick={previousHandler}
					color={index === 0 || isEmpty ? 'grey' : 'black'}
				/>
				<AiOutlinePlus onClick={addHandler} />
				<AiOutlineSearch
					onClick={searchHandler}
					color={isEmpty ? 'grey' : 'black'}
				/>
				<AiOutlineClose
					onClick={deleteHandler}
					color={isEmpty ? 'grey' : 'black'}
				/>
				<FaCaretRight
					onClick={nextHandler}
					color={
						index === keys.length - 1 || isEmpty ? 'grey' : 'black'
					}
				/>
			</div>
		</div>
	);
}

const NoteContent = (props) => {
	const { title, description, isEdit, titleChange, descriptionChange } =
		props;

	const toAddDescription =
		description === '' ? (
			<p onClick={descriptionChange}>
				No description. Click to add description
			</p>
		) : (
			<p onClick={descriptionChange}>{description}</p>
		);

	const titleComponent = isEdit.title ? (
		props.onEdit(true)
	) : (
		<h4 onClick={titleChange}>{title}</h4>
	);

	const descriptionComponent = isEdit.description
		? props.onEdit(false)
		: toAddDescription;

	return (
		<React.Fragment>
			{titleComponent}
			{descriptionComponent}
		</React.Fragment>
	);
};

export default Notes;
