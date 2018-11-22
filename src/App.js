import React, {Component, Fragment} from 'react';
import ReactPlayer from 'react-player'

import './App.scss';

class App extends Component {
    render() {
        return (
            <Fragment>
                <div className="player">
                    <div className="player__overlay"/>
                    <ReactPlayer
                        url='https://www.youtube.com/watch?v=PBwAxmrE194'
                        youtubeConfig={{
                            playerVars: {
                                showinfo: 0,
                                controls: 0,
                                disablekb: 1,
                                modestbranding: 1
                            }
                        }}
                    />
                </div>
                <div className="container">
                    Hello, world!
                </div>
            </Fragment>
        );
    }
}

export default App;
