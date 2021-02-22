import './App.css';
import Login from './components/login/Login';
import 'antd/dist/antd.css';
import { Route } from 'react-router-dom';
import Routing from './components/routers/Routing';
// import { BrowserRouter, Route, Switch } from 'react'


function App() {
  return (
    <div className="App">
      <Routing />
    </div>
  );
}

export default App;
