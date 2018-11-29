import React, {Component} from 'react'

/**
 * @return {null}
 */
function ButtonItem({button, handleButtonClick}) {
    return <li className="question__answer-item">
        <button className={`button ${button.class}`}
                onClick={(e) => handleButtonClick(button, e)}>
            {button.title}
        </button>
    </li>
}

function ListButtons(props) {
    const buttonsList = props.buttons
        // remove empty buttons from the list
        .filter(button => button.link !== null && button.title !== "")
        .map((button) =>
            <ButtonItem key={button.title} button={button} handleButtonClick={props.handleButtonClick}/>
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
        <ListButtons buttons={buttons} handleButtonClick={props.handleButtonClick}/>
    </section>
}

function RegularQuestion({props}) {
    const {title, buttons} = props.config;
    return <section className="question">
        <h2 className="question__title">{title}</h2>
        <ListButtons buttons={buttons} handleButtonClick={props.handleButtonClick}/>
    </section>
}

function Outro({props}) {
    const {title, description, buttons} = props.config;
    return <section className="question">
        <h2 className="question__title">
            {title}
        </h2>
        <div className="question__description">
            {description}
        </div>
        <ListButtons buttons={buttons} handleButtonClick={props.handleButtonClick}/>
    </section>
}

export default class Question extends Component {

    render() {
        const {type} = this.props.config;
        if (this.props.showQuestion) {
            switch (type) {
                case "intro":
                    return <Intro props={this.props}/>;
                case "outro":
                    return <Outro props={this.props}/>;
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