import React, { useState } from 'react';
import styles from './App.module.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Board from './components/Kanban/Board';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import Dashboard from './components/Dashboard/Dashboard';
import MainLayout from './Layout/MainLayout';
import ComingSoon from './pages/ComingSoon';

const noBackend = true;

function App() {
	const [userToken, setUserToken] = useState(noBackend);

	// TODO add Bearer Auth
	const onLoginHandler = (token) => {
		setUserToken(token);
	};

	const onLogoutHandler = () => {
		setUserToken('');
	};

	// TODO could be in another file?
	const showRoutes = userToken ? (
		<React.Fragment>
			<MainLayout onLogout={onLogoutHandler}>
				<Route path="/" exact>
					<Dashboard />
				</Route>
				<Route path="/tasks">
					<Board />
				</Route>
				<Route path="/calendar" component={ComingSoon} />
				<Route path="/expenses" component={ComingSoon} />
				<Route path="/notes" component={ComingSoon} />
			</MainLayout>
		</React.Fragment>
	) : (
		<React.Fragment>
			<Route path="/" exact>
				<Login onLogin={onLoginHandler} />
			</Route>
			<Route path="/register" component={Register} />
		</React.Fragment>
	);

	return (
		<div className={styles.app}>
			<Router>
				<Switch>{showRoutes}</Switch>
			</Router>
		</div>
	);
}

export default App;
