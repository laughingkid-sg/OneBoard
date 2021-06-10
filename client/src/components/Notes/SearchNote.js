import React, { useState, useContext, useRef } from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Label,
	Input,
	Table,
} from 'reactstrap';
import { AiOutlineClose } from 'react-icons/ai';
import ModalContext from '../../store/ModalContext';
import styles from './DeleteNote.module.css';

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

function SearchNote(props) {
	const modalContext = useContext(ModalContext);
	const queryRef = useRef('');
	const [filteredList, setFilteredList] = useState(ITEMS);
	const [checkBox, setCheckBox] = useState({
		title: true,
		description: true,
	});

	// TODO Should change to useEffect?
	const toggleTitleHandler = () => {
		setCheckBox({ ...checkBox, title: !checkBox.title });
		searchHandler();
	};

	const toggleDescriptionHandler = () => {
		setCheckBox({ ...checkBox, description: !checkBox.description });
		searchHandler();
	};

	const searchHandler = () => {
		const query = queryRef.current.value.toLowerCase();
		if (!query || !(checkBox.description || checkBox.title)) {
			setFilteredList(ITEMS);
		} else {
			let hits = {};
			for (const key in ITEMS) {
				const note = ITEMS[key];
				const lowerTitle = note.title.toLowerCase();
				const lowerDesc = note.description.toLowerCase();
				if (
					(lowerTitle.includes(query) && checkBox.title) ||
					(lowerDesc.includes(query) && checkBox.description)
				) {
					hits[note.id] = note;
				}
			}
			// ? If the filtered list doesn't change no need to rerender
			setFilteredList(hits);
		}
	};

	return (
		// TODO Change width of modal to accommodate longer description
		<Modal isOpen={modalContext.isVisible} toggle={modalContext.hideModal}>
			<AiOutlineClose
				onClick={modalContext.hideModal}
				className={`${styles.close} me-3 mt-3`}
			/>
			<ModalHeader>Find Note</ModalHeader>
			<ModalBody>
				<Input
					type="text"
					placeholder="Enter text to search"
					onChange={searchHandler}
					innerRef={queryRef}
				/>
				<Input
					type="checkbox"
					id="title"
					name="title"
					checked={checkBox.title}
					onChange={toggleTitleHandler}
				/>
				<Label for="title">Title</Label>
				<Input
					type="checkbox"
					id="description"
					name="description"
					checked={checkBox.description}
					onChange={toggleDescriptionHandler}
				/>
				<Label for="description">Description</Label>
				<FilteredTable filtered={filteredList} goTo={props.goTo} />
			</ModalBody>
			<ModalFooter>
				<Button color="danger" outline onClick={modalContext.hideModal}>
					Close
				</Button>
			</ModalFooter>
		</Modal>
	);
}

const FilteredTable = (props) => {
	const { filtered } = props;
	const keys = Object.keys(filtered);
	const filteredArr = keys.map((key) => filtered[key]);

	const goToHandler = (key) => {
		props.goTo(key);
	};

	const renderListItems = filteredArr.map((note, index) => (
		<tr
			onClick={goToHandler.bind(null, keys[index])}
			key={note.id}
			style={{ cursor: 'pointer' }}
		>
			<td>{index + 1}</td>
			<td>{note.title}</td>
			<td>{note.description}</td>
		</tr>
	));

	if (keys.length === 0) return <h4>No results!</h4>;

	return (
		<Table striped>
			<thead>
				<tr>
					<th>S/N</th>
					<th>Title</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>{renderListItems}</tbody>
		</Table>
	);
};

export default SearchNote;
