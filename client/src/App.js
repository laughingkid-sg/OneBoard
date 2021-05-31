import React from 'react';
import { useSelector } from 'react-redux';
import styles from './App.module.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Board from './components/Kanban/Board';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import Dashboard from './components/Dashboard/Dashboard';
import MainLayout from './Layout/MainLayout';
import ComingSoon from './pages/ComingSoon';

function App() {
	const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

	// TODO could be in another file?
	const showRoutes = isLoggedIn ? (
		<React.Fragment>
			<MainLayout>
				<Route path="/" exact>
					<Dashboard />
				</Route>
				<Route path="/tasks">
					<div className={styles.container}>
						<Board />
					</div>
				</Route>
				<Route path="/calendar" component={ComingSoon} />
				<Route path="/expenses" component={ComingSoon} />
				<Route path="/notes" component={ComingSoon} />
			</MainLayout>
		</React.Fragment>
	) : (
		<React.Fragment>
			<Route path="/" exact>
				<Login />
			</Route>
			<Route path="/register" component={Register} />
		</React.Fragment>
	);

	return (
		<div className={styles.app}>
			{console.log(isLoggedIn)}
			<Router>
				<Switch>{showRoutes}</Switch>
			</Router>
		</div>
	);
}

export default App;
