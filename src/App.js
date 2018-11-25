import React, {Component, Fragment} from 'react';
import ReactPlayer from 'react-player'
import config from './components/quiz-setup'
import vtt from 'vtt.js'
import subtitles from './components/subtitles.vtt'


import './App.scss';
import Question from "./components/Question";
import {Subtitle} from "./components/Subtitle";


class App extends Component {
    state = {
        playing: true,
        config: config.slides,
        currentQuestion: 0,
        muted: false,
        showQuestion: true, // first slide must show immediately
        cues: null,
        currentCue: null
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

    componentDidMount() {
        let WebVTT = vtt.WebVTT;
        let parser = new WebVTT.Parser(window, WebVTT.StringDecoder()),
            cues = [],
            regions = [];
        parser.oncue = function (cue) {
            cues.push(cue);
        };
        parser.onregion = function (region) {
            regions.push(region);
        };

        fetch(subtitles)
            .then(response => response.text())
            .then(text => {
                parser.parse(text);
                parser.flush();
                this.setState({cues: cues})
            })
    }

    getCurrentCue(cues, currentTime) {
        let currentCue;
        [currentCue]= cues.filter(cue => currentTime >= cue.startTime && currentTime <= cue.endTime);
        return currentCue;
    }

    onProgress = state => {
        const {playedSeconds} = state;
        const {videoEnd, showQuestion} = this.state.config[this.state.currentQuestion];

        this.setState({currentCue: this.getCurrentCue(this.state.cues, playedSeconds)})

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
        const {playing, currentQuestion, config, muted, showQuestion, currentCue} = this.state;

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
                <div id="overlay"/>
                <Question config={config[currentQuestion]}
                          advanceState={this.advanceToNextState}
                          showQuestion={showQuestion}/>
                <Subtitle cue={currentCue}/>
            </Fragment>
        );
    }
}

export default App;
