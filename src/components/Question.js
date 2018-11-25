import React, {Component} from 'react'

function ListButtons(props) {

    const buttonsList = props.buttons.map((button) =>
        <li>
            <button className={`button ${button.class}`}> {button.title}</button>
        </li>
    );

    return (
        <ul>{buttonsList}</ul>
    )
}

function Intro(props) {
    const {title, description, buttons} = props.config;
    return <section className="question">
        <h2 className="question__title">
            {title}
        </h2>
        <div className="question__description">
            {description}
        </div>
        <ListButtons buttons={buttons}/>
    </section>
}

function RegularQuetion(props) {
    return <section className="question">
        <h2 className="question__title">{props.title}</h2>
    </section>
}

export default class Question extends Component {

    render(props) {

        const {type} = this.props.currentConfig;

        switch (type) {
            case "intro":
                return <Intro config={this.props.currentConfig}/>;
            case "question":
                return <RegularQuetion config={this.props.currentConfig}/>
            default:
                return <div>Error loading the question</div>;

        }


    }
}