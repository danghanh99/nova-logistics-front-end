import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import './App.css';
import Login from './pages/Login';
import TheLayout from './containers/TheLayout';
import { useSelector } from 'react-redux';
import AuthService from './services/AuthService';
type State = {
  isLogin: boolean;
};

function App() {
  const isLoggedIn = useSelector((state: State) => state.isLogin);

  return (
    <Router>
      {!isLoggedIn || !AuthService.isExpired() ? (
        <Redirect to="/login" />
      ) : (
        <Redirect to="/admin/exports" />
      )}
      <Route path="/login" component={Login} />
      <Route path={['/admin']} component={TheLayout} />
    </Router>
  );
}

export default App;
