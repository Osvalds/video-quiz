import React, {Component, Fragment} from 'react';
import VideoQuiz from './components/VideoQuiz';
import {HashRouter, Route, Switch} from "react-router-dom";
import './App.scss';

const OutroUno = (props) => {
    console.log(props)
    return <h2>OutroUNO</h2>;
}
const OutroDuo = () => <h2>Outro DUO, DAWG</h2>;

class App extends Component {




    render() {
        return (
            <HashRouter basename={"/" + process.env.PUBLIC_URL}>
                <Fragment>
                    <Switch>
                        <Route path="/" exact component={VideoQuiz}/>
                        <Route path="/outro-uno" component={OutroUno}/>
                        <Route path="/outro-duo" component={OutroDuo}/>
                    </Switch>
                </Fragment>
            </HashRouter>
        );
    }
}


export default App;
