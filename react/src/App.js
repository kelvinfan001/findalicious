import React from 'react';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
// import TinderCardComponent from './components/TinderCard/TinderCard';
import Home from './components/Home/Home';
import { RoomNotFound, PageNotFound } from './components/NotFound/NotFound';
import CreateRoom from './components/Rooms/CreateRoom';
import Lobby from './components/Rooms/Lobby';
import './App.css';
import io from 'socket.io-client';

let expressServer = process.env.REACT_APP_EXPRESS_SERVER;
let socket = io.connect(expressServer, {
  reconnection: false
});

class App extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/rooms/:roomNumber" render={(props) => (<Lobby {...props} socket={socket} />)} />
            <Route exact path='/' component={Home} />
            <Route exact path='/create' render={(props) => (<CreateRoom {...props} socket={socket} />)} />
            <Route exact path="/rooms" component={RoomNotFound} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export { App, socket };
