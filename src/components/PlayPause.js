import React from 'react'
import {HotKeys} from "react-hotkeys";

export function PlayPause(props) {
    if (props.gameStarted) {
        return <button onClick={props.onClick}>{props.playing ? "Pause" : "Play"}</button>

    } else {
        return null;
    }
}