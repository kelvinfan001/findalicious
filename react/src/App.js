import React from 'react';
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import Home from './components/Home/Home';
import { RoomNotFound, PageNotFound, UserDisconnect, RoomAlreadyStartedSwiping } from './components/NotFound/NotFound';
import CreateRoom from './components/Rooms/CreateRoom';
import Lobby from './components/Rooms/Lobby';
import './App.css';
import io from 'socket.io-client';
import TestPageComponent from './components/TestPage/TestPage';
import Swiping from './components/Swiping/Swiping';

let expressServer = process.env.REACT_APP_EXPRESS_SERVER;
let socket = io.connect(expressServer, {
  reconnection: true
});

class App extends React.Component {

  render() {
    return (
      <Router>
        <div>
          <Switch>
            <Route exact path="/rooms/:roomNumber" render={(props) => (<Lobby {...props} socket={socket} />)} />
            <Route exact path='/' render={(props) => (<Home {...props} socket={socket} />)} />
            <Route exact path='/create' render={(props) => (<CreateRoom {...props} socket={socket} />)} />
            <Route exact path='/swiping' render={(props) => (<Swiping {...props} socket={socket} />)} />
            <Route exact path="/rooms" component={RoomNotFound} />
            <Route exact path="/test" component={TestPageComponent} />
            <Route exact path="/disconnect" component={UserDisconnect} />
            <Route exact path="/already-swiping" component={RoomAlreadyStartedSwiping} />
            <Route component={PageNotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export { App, socket };
