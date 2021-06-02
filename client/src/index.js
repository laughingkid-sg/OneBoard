import React from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import './index.css';
import App from './App';
import { AuthContextProvider } from './store/AuthContext';
import store from './store/index';

ReactDOM.render(
	<AuthContextProvider>
		<Provider store={store}>
			<App />
		</Provider>
	</AuthContextProvider>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
