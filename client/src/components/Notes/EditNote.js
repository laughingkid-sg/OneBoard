import { Input, InputGroup, InputGroupAddon, InputGroupText } from 'reactstrap';

const EditNote = (props) => {
	const { isTitle, onCancel, data } = props;
	const cancelHandler = (e) => {
		const newData = e.target.value;
		if (newData === data) {
			onCancel();
			return;
		}

		// ! POST Request to make changes
		onCancel();
	};

	return (
		<InputGroup>
			{/* ! Description Mode height does not match w textarea */}
			{/* <InputGroupAddon addonType="prepend">
				<InputGroupText
					className="m-0"
					style={{ whiteSpace: 'pre-line' }}
				>
					Edit {isTitle ? 'Title' : `\nDescription`}
				</InputGroupText>
			</InputGroupAddon> */}
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
