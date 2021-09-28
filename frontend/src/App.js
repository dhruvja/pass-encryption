import './App.css';
import {Route, BrowserRouter as Router,Switch} from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Vault from './pages/Vault'
import Folder from './pages/Folder'

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/folder" component={Folder} />
          <Route path="/vault" component={Vault} />
          <Route path="/register" component={Register} />
          <Route path="/" component={Login} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
