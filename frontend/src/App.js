import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login';
import Register from "./Register";
import MainPage from "./MainPage";
import Upload from "./Upload";
import Evaluate from "./Evaluate";
import Teacher from "./Teacher";
import {
  Route,
  HashRouter
}
from "react-router-dom";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isProfessor: 0
    };
  }

  setProfessor = () => {
    if (this.state.isProfessor === 0) {
      this.setState({
        isProfessor: 1
      });
    }
  }

  render() {
    return (
      <HashRouter>
          <Route exact path ="/" component={() => {return <Login setProfessor={this.setProfessor}/>}} />
          <Route path="/register" component={() => {return <Register setProfessor={this.setProfessor}/>}}/>
          <Route path = "/mainpage" component={() => {return <MainPage isProfessor={this.state.isProfessor}/>}} />
          <Route path = "/upload" component={() => {return <Upload/>}} />
          <Route path = "/evaluate" component={() => {return <Evaluate/>}} />
          <Route path = "/teacher" component={() => {return <Teacher/>}} />
      </HashRouter>
    );
  }
}

export default App;