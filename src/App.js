import './App.css';
import Forget from './components/login/Forget';
import Login from './components/login/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'antd/dist/antd.css';


function App() {
  return (
    <div className="App">
      <Router>
        <Login />
        <Route path='/forget_password' component={Forget} />
      </Router>
    </div>
  );
}

export default App;
