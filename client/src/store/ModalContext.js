import React, { useState } from 'react';

const ModalContext = React.createContext({
	isVisible: false,
	modal: null,
	showModal: (modal) => {},
	hideModal: () => {},
});

export const ModalContextProvider = (props) => {
	const [isVisible, setIsVisible] = useState(false);
	const [modal, setModal] = useState(null);

	const openModalHandler = (modal) => {
		setIsVisible(true);
		setModal(modal);
	};

	const closeModalHandler = () => {
		setIsVisible(false);
		setModal(null);
	};

	const modalContext = {
		isVisible,
		modal,
		showModal: openModalHandler,
		hideModal: closeModalHandler,
	};

	return (
		<ModalContext.Provider value={modalContext}>
			{props.children}
		</ModalContext.Provider>
	);
};

export default ModalContext;
