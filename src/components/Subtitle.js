import React from 'react'

export function Subtitle ({cue}) {
    if(cue) {
        return <div className="subtitle">{cue.text}</div>
    } else {
        return null;
    }
}