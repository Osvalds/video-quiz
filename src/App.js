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
        muted: false,
        showQuestion: true, // first slide must show immediately
    };

    playPause = () => {
        this.setState({playing: !this.state.playing})
    };

    toggleMuted = () => {
        this.setState({muted: !this.state.muted})
    };

    advanceToNextState = (nextState) => {
        this.setState({
            currentQuestion: nextState,
            showQuestion: false,
            playing: true
        });
        this.player.seekTo(this.state.config[nextState].videoStart);
    };

    onFragmentStart = e => {
        console.log("onstart", e);
    };

    onProgress = state => {
        console.log(state);
        const {playedSeconds} = state;
        const {videoEnd, showQuestion, loopStart} = this.state.config[this.state.currentQuestion];

        if (playedSeconds >= showQuestion) {
            this.setState({
                showQuestion: true
            })
        }

        if (playedSeconds >= videoEnd) {
            this.setState({
                showQuestion: true,
                playing: false
            });
        }
    };

    ref = player => {
        this.player = player
    };

    render() {
        const {playing, currentQuestion, config, muted, showQuestion} = this.state;

        return (
            <Fragment>
                <ReactPlayer
                    ref={this.ref}

                    url='https://youtu.be/xn978i9opgY'
                    config={{
                        youtube: {
                            playerVars: {
                                showinfo: 0,
                                controls: 0,
                                rel: 0,
                                disablekb: 1,
                                modestbranding: 1,
                                playsinline: 1
                            }
                        },
                        file: {
                            tracks: [
                                {kind: 'subtitles', src: 'http://demo.turn.lv/peteris/video-link/captions.vvt', srcLang: 'en', default: true},
                            ]
                        }
                    }}
                    progressInterval={500}
                    volume={0.8}
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
                    <button onClick={(e) => this.advanceToNextState(currentQuestion + 1, e)}>Next</button>
                </div>
                <Question config={config[currentQuestion]}
                          advanceState={this.advanceToNextState}
                          showQuestion={showQuestion}/>
            </Fragment>
        );
    }
}

export default App;
