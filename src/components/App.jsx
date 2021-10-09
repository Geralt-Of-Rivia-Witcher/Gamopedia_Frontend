import React from "react"

import Game from "./Game_Page/Game.jsx";
import Home from "./Home_Page/Home.jsx";

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
  

function App()
{

    return(
        <Router>
            <Switch>
                <Route exact path="/" component={ Home } />
                <Route exact path="/Game" component={ Game } />
            </Switch>
        </Router>
    );
}

export default App;