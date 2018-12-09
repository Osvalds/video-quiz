import React, {Component} from 'react';
import ReactPlayer from 'react-player'
import config from './quiz-setup'
import vtt from 'vtt.js'
import subtitles from './subtitles.vtt'
import ReactHowler from 'react-howler'
import ReactGA from 'react-ga'
import {HotKeys} from "react-hotkeys";
import Question from "./Question";
import {Subtitle} from "./Subtitle";
import {Debug} from "./Debug";
import {PlayPause} from "./PlayPause";

const TYPE_NEXTVIDEO = "nextVideo";
const TYPE_OUTRO = "outro";

const keyMap = {
    toggleDebug: 'command+shift+1'
};

class VideoQuiz extends Component {

    state = {
        playing: true,
        config: config,
        currentQuestion: 0,
        muted: true,
        showQuestion: true, // first slide must show immediately
        cues: null,
        currentCue: null,
        volume: 0.8,
        debug: false,
        audioPlaying: true,
        gameStarted: false,
        givenAnswers: []
    };

    onToggleDebug = () => {
        this.setState({debug: !this.state.debug})
    };

    playPause = () => {
        this.setState({
            playing: !this.state.playing,
            audioPlaying: !this.state.audioPlaying
        });
    };

    toggleMuted = (muted = !this.state.muted) => {
        this.backgroundSound.mute(!this.state.muted);
        this.setState({muted: !this.state.muted})
    };

    forceStart = () => {
        this.setState({muted: false});
        this.advanceToNextState(0);
    };

    advanceToNextState = (nextState) => {
        this.setState({
            currentQuestion: nextState,
            showQuestion: false,
            playing: true
        });
        this.player.seekTo(this.state.config.slides[nextState].videoStart);
    };

    advanceToNextQuestionSlide = (nextState) => {
        let nextSlide = this.state.config.slides[nextState];
        // if the type is "NextVideo" there's not gonna be any question there so we can just skip it
        if (nextSlide.type === TYPE_NEXTVIDEO) {
            this.advanceToNextQuestionSlide(nextSlide.nextVideoID)
        } else {
            this.setState({
                currentQuestion: nextState,
                showQuestion: true,
                playing: true
            });
            this.player.seekTo(this.state.config.slides[nextState].videoEnd - 1);
        }
    };

    initializeGa = (gaID) => {
        if (gaID !== "") {
            ReactGA.initialize(gaID);
            // Taken from example here: https://github.com/react-ga/react-ga#with-npm
            ReactGA.pageview(window.location.pathname + window.location.search);
        }
    };

    // There will propably be more params here, like "Category" and "Label" not just action
    trackGaEvent = gaAction => {
        if (gaAction !== "") {
            ReactGA.event({
                action: gaAction,
                category: "fooo" // there must be something more meaningful here
            });
        }
    };

    handleQuizButtonClick = (button, questionType, slideConfig) => {
        let {link, "ga-action": gaAction} = button;
        let givenAnswers = this.state.givenAnswers;
        givenAnswers.push({
            clickedButton: button,
            slideConfig: slideConfig
        });

        if (questionType === "intro") {
            this.setState({gameStarted: true});
            this.toggleMuted(false);
        }

        this.advanceToNextState(link);
        this.trackGaEvent(gaAction);

        this.setState({givenAnswers: givenAnswers})

        let nextSlide = this.state.config.slides[link];
        // if the next type is otry, we will just push the next url here and the app will just redirect
        if (nextSlide.type === TYPE_OUTRO) {
            this.props.history.push("/outro-uno")
        }

    };

    componentDidMount() {
        this.initializeGa(this.state.config.googleAnalyticsID);
        // Taken from Mozilla's github
        let WebVTT = vtt.WebVTT;
        // thanks, Safari
        const oldVTTCue = window.VTTCue;

        let parser = new WebVTT.Parser(window, WebVTT.StringDecoder()),
            cues = [],
            regions = [];
        parser.oncue = function (cue) {
            cues.push(cue);
        };
        parser.onregion = function (region) {
            regions.push(region);
        };
        try {
            // thanks, safari
            window.VTTCue = vtt.VTTCue;
            fetch(subtitles)
                .then(response => response.text())
                .then(text => {
                    parser.parse(text);
                    parser.flush();
                    this.setState({cues: cues})
                })
        } finally {
            window.VTTCue = oldVTTCue;
        }

    }

    getCurrentCue(cues, currentTime) {
        let currentCue;
        [currentCue] = cues.filter(cue => currentTime >= cue.startTime && currentTime <= cue.endTime);
        return currentCue;
    }

    onProgress = playerState => {
        const {playedSeconds} = playerState;
        const {currentQuestion, cues, config} = this.state;
        const {videoEnd, showQuestion, type, nextVideoID} = config.slides[currentQuestion];

        // handles which subtitle should be shown, doesn't depend on the slide type
        this.setState({currentCue: this.getCurrentCue(cues, playedSeconds)});

        switch (type) {
            case TYPE_NEXTVIDEO:
                if (playedSeconds >= videoEnd) {
                    this.advanceToNextState(nextVideoID);
                }
                break;
            default:
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
        }
    };

    render() {
        const {playing, currentQuestion, config, muted, showQuestion, currentCue, volume, audioPlaying, gameStarted} = this.state;
        const handlers = {
            'toggleDebug': this.onToggleDebug
        };
        return (
            <HotKeys keyMap={keyMap}
                     handlers={handlers}
                     focused={true}>

                <ReactPlayer
                    ref={(ref) => (this.player = ref)}
                    url={config.videoUrl}
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
                    progressInterval={100}
                    volume={volume}
                    playing={playing}
                    width={"auto"}
                    height={"auto"}
                    muted={muted}
                    className={"player"}
                    onProgress={this.onProgress}
                />
                <Debug visible={this.state.debug}
                       state={this.state}
                       onForceStart={this.forceStart}
                       onPlayPause={(e) => this.playPause(e)}
                       onToggleMuted={this.toggleMuted}
                       onSlideButtonClick={this.advanceToNextQuestionSlide}
                       onNext={(e) => this.advanceToNextQuestionSlide(currentQuestion + 1, e)}/>
                {/*<ReactHowler src={config.audioBgr}*/}
                <ReactHowler src={process.env.PUBLIC_URL + "/media/muzons_fonam.mp3"}
                             playing={audioPlaying}
                             loop={true}
                             volume={volume}
                             mute={muted}
                             ref={(ref) => (this.backgroundSound = ref)}/>
                <Question config={config.slides[currentQuestion]}
                          handleButtonClick={this.handleQuizButtonClick}
                          showQuestion={showQuestion}
                          location={this.props.location}/>
                <Subtitle cue={currentCue}/>
                {/*using gameStarted and playing attributes it would be really easy to add overlay over the video when game is paused*/}
                <PlayPause onClick={(e) => this.playPause(e)}
                           playing={playing}
                           gameStarted={gameStarted}/>
                <button onClick={this.toggleMuted}>{muted ? "Unmute" : "Mute"}</button>
            </HotKeys>
        );
    }
}

export default VideoQuiz;
