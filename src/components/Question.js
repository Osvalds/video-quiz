import React, {Component} from 'react'

function ListButtons(props) {
    const buttonsList = props.buttons.map((button) =>
        <li className="question__answer-item"
            key={button.title}>
            <button className={`button ${button.class}`}
                    onClick={(e) => props.advanceState(button.link, e)}>
                {button.title}
            </button>
        </li>
    );

    return (
        <ul className="question__answer-list">{buttonsList}</ul>
    )
}

function Intro({props}) {
    const {title, description, buttons} = props.config;
    return <section className="question">
        <h2 className="question__title">
            {title}
        </h2>
        <div className="question__description">
            {description}
        </div>
        <ListButtons buttons={buttons} advanceState={props.advanceState}/>
    </section>
}

function RegularQuestion({props}) {
    const {title, buttons} = props.config;
    return <section className="question">
        <h2 className="question__title">{title}</h2>
        <ListButtons buttons={buttons} advanceState={props.advanceState}/>
    </section>
}

export default class Question extends Component {

    render() {
        const {type} = this.props.config;
        if (this.props.showQuestion) {
            switch (type) {
                case "intro":
                    return <Intro props={this.props}/>;
                case "question":
                    return <RegularQuestion props={this.props}/>;
                default:
                    return <div>Error loading the question</div>;

            }
        } else {
            return null;
        }


    }
}