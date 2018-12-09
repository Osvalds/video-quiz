import React, {Component, Fragment} from 'react';
import VideoQuiz from './components/VideoQuiz';
import {BrowserRouter as Router, Route} from "react-router-dom";
import './App.scss';

const OutroUno = () => <h2>OutroUNO</h2>;
const OutroDuo = () => <h2>Outro DUO, DAWG</h2>;

class App extends Component {

    render() {
        return (
            <Router>
                <Fragment>
                    <Route path="/" exact component={VideoQuiz}/>
                    <Route path="/outro-uno" component={OutroUno}/>
                    <Route path="/outro-duo" component={OutroDuo}/>
                </Fragment>
            </Router>
        );
    }
}

export default App;
