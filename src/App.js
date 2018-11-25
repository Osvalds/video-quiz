import React, {Component, Fragment} from 'react';
import ReactPlayer from 'react-player'
import config from './components/quiz-setup'
import Quiz from './components/Quiz.js'

import './App.scss';

class App extends Component {
    state = {
        playing: false,
        config: config.slides,
        currentQuestion: 0
    };

    playPause = () => {
        this.setState({playing: !this.state.playing})
    };

    render() {
        const {playing, currentQuestion, config} = this.state;

        return (
            <Fragment>
                <ReactPlayer
                    url='https://www.youtube.com/watch?v=PBwAxmrE194'
                    config={{
                        youtube: {
                            playerVars: {
                                showinfo: 0,
                                controls: 0,
                                disablekb: 1,
                                modestbranding: 1
                            }

                        }
                    }}
                    playing={playing}
                    width={"auto"}
                    height={"auto"}
                    className={"player"}
                />
                <div className="controls">
                    <button onClick={this.playPause}>{playing ? "Pause" : "Play"}</button>
                </div>
                <Quiz currentConfig={config[currentQuestion]}/>
            </Fragment>
        );
    }
}

export default App;
