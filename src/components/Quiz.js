import React, {Component} from 'react'
import Question from './Question.js'

 export default class Quiz extends Component{

     render() {
        return <Question currentConfig={this.props.currentConfig} />;
    }
}