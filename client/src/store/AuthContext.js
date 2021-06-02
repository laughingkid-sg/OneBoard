import React, { useState } from 'react';
import { useCookies } from 'react-cookie';

const AuthContext = React.createContext({
	token: '', // Could use cookie to store this instead
	isLoggedIn: false,
	login: (token) => {},
	logout: () => {},
});

let cookieExpiry;

export const AuthContextProvider = (props) => {
	const [cookie, setCookie, removeCookie] = useCookies(['t']);
	const [token, setToken] = useState('');
	const isLoggedIn = !!token;

	const loginHandler = (token) => {
		setToken(token);
		cookieExpiry = setTimeout(logoutHandler, 3600000);
	};

	const logoutHandler = () => {
		removeCookie('t');
		removeCookie('id');
		setToken('');
		clearTimeout(cookieExpiry);
	};

	const authContext = {
		token: token,
		isLoggedIn: isLoggedIn,
		login: loginHandler,
		logout: logoutHandler,
	};

	return (
		<AuthContext.Provider value={authContext}>
			{props.children}
		</AuthContext.Provider>
	);
};

export default AuthContext;
