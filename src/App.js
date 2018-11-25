import React, {Component, Fragment} from 'react';
import ReactPlayer from 'react-player'
import config from './components/quiz-setup'

import './App.scss';
import Question from "./components/Question";

class App extends Component {
    state = {
        playing: true,
        config: config.slides,
        currentQuestion: 0,
        muted: false
    };

    playPause = () => {
        this.setState({playing: !this.state.playing})
    };

    toggleMuted = () => {
        this.setState({muted: !this.state.muted})
    };


    advanceToNextState = (nextState) => {
        this.setState({currentQuestion: nextState})
    };

    onFragmentStart = e => {
        console.log("onstart", e);
    };

    onProgress = state => {
        console.log('onProgress', state)
        const {playedSeconds} = state;
        const {videoEnd, loopStart} = this.state.config[this.state.currentQuestion];
        console.log(loopStart, videoEnd);
        if (playedSeconds >= videoEnd ) {
            this.player.seekTo(parseFloat(loopStart))
        }
    };

    ref = player => {
        this.player = player
    };

    render() {
        const {playing, currentQuestion, config, muted} = this.state;

        return (
            <Fragment>
                <ReactPlayer
                    ref={this.ref}

                    url='https://youtu.be/hp0hHFa_GXU'
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
                    muted={muted}
                    className={"player"}
                    onStart={this.onFragmentStart}
                    onProgress={this.onProgress}
                />
                <div className="controls">
                    <button onClick={this.playPause}>{playing ? "Pause" : "Play"}</button>
                    <button onClick={this.toggleMuted}>{muted ? "Unmute" : "Mute"}</button>
                </div>
                <Question config={config[currentQuestion]}
                          advanceState={this.advanceToNextState}/>
            </Fragment>
        );
    }
}

export default App;
