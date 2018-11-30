import React from 'react'


function AllSlides (props) {
    return props.slides.map(slide =>
        <button key={`${slide.id}${slide.Filename}`}
        onClick={(e) => props.onButtonClick (slide.id, e)}>{slide.id}: {slide.Filename}</button>
    )
}

export function Debug(props) {
    if (props.visible) {
        return <div className="debug">
            <button onClick={props.onPlayPause}>{props.state.playing ? "Pause" : "Play"}</button>
            <button onClick={props.onNext}>Next question</button>
            <button onClick={props.onToggleMuted}>{props.state.muted ? "Unmute" : "Mute"}</button>
            <div onClick={props.onForceStart} className="force-start">Force Start</div>
            <ul>
                <AllSlides slides={props.state.config.slides}
                onButtonClick={props.onSlideButtonClick}/>
            </ul>
        </div>
    } else {
        return null;
    }
}