import { useState } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import {
	Badge,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
} from 'reactstrap';

const LabelSelect = (props) => {
	const { labelTypes } = props;
	const [labelDropDownOpen, setLabelDropdownOpen] = useState(false);

	const toggleDropdownHandler = () => {
		setLabelDropdownOpen((prevOpen) => !prevOpen);
	};

	return (
		<Dropdown isOpen={labelDropDownOpen} toggle={toggleDropdownHandler}>
			<DropdownToggle>
				<AiOutlinePlus />
			</DropdownToggle>
			<DropdownMenu>
				<DropdownItem header>Label</DropdownItem>
				{labelTypes.map((label) => (
					// ! Probably need to adjust key
					<DropdownItem key={label}>
						<Badge className={`bg-${label} m-0`}>{label}</Badge>
					</DropdownItem>
				))}
			</DropdownMenu>
		</Dropdown>
	);
};

export default LabelSelect;
