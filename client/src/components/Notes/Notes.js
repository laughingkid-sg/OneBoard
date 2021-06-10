import React, { useEffect, useState, useContext } from 'react';
import { AiOutlinePlus, AiOutlineClose, AiOutlineSearch } from 'react-icons/ai';
import { FaCaretLeft, FaCaretRight } from 'react-icons/fa';
import AddNote from './AddNote';
import DeleteNote from './DeleteNote';
import SearchNote from './SearchNote';
import EditNote from './EditNote';
import ModalContext from '../../store/ModalContext';

const ITEMS = {
	'task-1': {
		id: 'task-1',
		title: 'Sciencey',
		description: 'mitochondria is the powerhouse of the cell',
	},
	'task-2': {
		id: 'task-2',
		title: 'Prof Aaron',
		description: "it's fun time!",
	},
	'task-3': {
		id: 'task-3',
		title: 'Lost somewhere',
		description: 'Why am I writing this',
	},
};

const keys = Object.keys(ITEMS);
function Notes(props) {
	// TODO this should be moved to redux slice
	const [index, setIndex] = useState(0);
	const [key, setKey] = useState(keys[index]);
	const [isAdd, setIsAdd] = useState(false);
	const [isEdit, setIsEdit] = useState({ title: false, description: false });
	const modalContext = useContext(ModalContext);

	useEffect(() => {
		setKey(keys[index]);
	}, [index]);

	const nextHandler = () => {
		if (index === ITEMS.length - 1) return;
		setIndex(index + 1);
	};

	const previousHandler = () => {
		if (index === 0) return;
		setIndex(index - 1);
	};

	const deleteHandler = () => {
		modalContext.showModal(<DeleteNote note={ITEMS[key]} />);
	};

	const addHandler = () => {
		// Ensures that the user is not editing before adding new task
		for (const key in isEdit) {
			if (isEdit[key]) return;
		}

		setIsAdd(true);
	};

	const searchHandler = () => {
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
			onCancel={isTitle ? titleToggleHandler : descriptionToggleHandler}
			data={isTitle ? ITEMS[key].title : ITEMS[key].description}
			isTitle={isTitle}
		/>
	);

	if (isAdd) {
		return (
			<AddNote
				onCancel={() => {
					setIsAdd(false);
				}}
			/>
		);
	}

	const titleComponent = isEdit.title ? (
		makeEditNote(true)
	) : (
		<h4 onClick={titleToggleHandler}>{ITEMS[key].title}</h4>
	);

	const descriptionComponent = isEdit.description ? (
		makeEditNote(false)
	) : (
		<p onClick={descriptionToggleHandler}>{ITEMS[key].description}</p>
	);

	return (
		<div className="d-flex flex-column justify-content-between">
			<div>
				{titleComponent}
				{descriptionComponent}
			</div>
			<div style={{ fontSize: '1.75rem', cursor: 'pointer' }}>
				<FaCaretLeft
					onClick={previousHandler}
					color={index === 0 ? 'grey' : 'black'}
				/>
				<AiOutlinePlus onClick={addHandler} />
				<AiOutlineSearch onClick={searchHandler} />
				<AiOutlineClose onClick={deleteHandler} />
				<FaCaretRight
					onClick={nextHandler}
					color={index === ITEMS.length - 1 ? 'grey' : 'black'}
				/>
			</div>
		</div>
	);
}

export default Notes;
