import { useState } from 'react';
import styles from './App.module.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Board from './components/Kanban/Board';
import Login from './components/Login/Login';
import Register from './components/Login/Register';
import Home from './pages/Home';
import Products from './pages/Products';
import Reports from './pages/Reports';
import Sidebar from './UI/Sidebar';

function App() {
	const [userToken, setUserToken] = useState('');

	// TODO add Bearer Auth
	const onLoginHandler = (token) => {
		setUserToken(token);
	};

	return (
		//  <Register />
		// <Login />
		<div className="App">
			{/* <Board /> */}
			<Router>
				{/* <Sidebar /> */}
				<Switch>
					{!userToken && (
						<Route
							path="/"
							exact
							component={() => <Login onLogin={onLoginHandler} />}
						/>
					)}
					{!userToken && (
						<Route path="/register" component={Register} />
					)}
					{userToken && <Route path="/" exact component={Board} />}
					{/* <Route path="/" exact component={Home} /> */}
					{/* <Route path="/reports" component={Reports} /> */}
					{/* <Route path="/products" component={Products} />  */}
				</Switch>
			</Router>
		</div>
	);
}

export default App;
