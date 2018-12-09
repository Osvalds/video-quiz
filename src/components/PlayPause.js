import React from 'react'

export function PlayPause(props) {
    if (props.gameStarted) {
        return <button onClick={props.onClick}>{props.playing ? "Pause" : "Play"}</button>

    } else {
        return null;
    }
}