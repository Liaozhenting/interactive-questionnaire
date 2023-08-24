import React, { Component } from 'react';
import check from './check';

const transform = obj => {
  let id = obj.qName;
  return {
    [id]: obj
  };
};

const normalize = arr => {
  return arr.reduce((accumulator, currentValue) => {
    let value = transform(currentValue);
    return {...accumulator, ...value};
  }, {});
}

class Questionnaire extends Component {
  constructor(props) {
    super(props);
    this.state = {
      qNames: props.data.map(ele => ele.qName),
      normalized: normalize(props.data)
    };
    console.log('originState',this.state);
    console.log('props.rule',props.rule);
    console.log('check', check(props.rule));
    this.ruleCheck = check(props.rule);
  }

  getQuestionEntity = (qName) => {
    return this.state.normalized[qName];
  }

  choose = (qName, index) => {
    let {normalized} = this.state;
    let {rule} = this.props;
    let question = this.getQuestionEntity(qName);
    question.answer = index;
    let newNormalized = {...normalized, ...{[qName]: question}};
    newNormalized = this.ruleCheck(newNormalized);
    this.setState({normalized:newNormalized}, ()=>{
      console.log('this.state', this.state);
    })
  }

  renderOption = (ele, qName) => {
    
    return ele.options.map((option, index)=>{
      let style = ele.answer === index ?  {color: 'red'} : {color: 'white'};
      return <p style={style} onClick={()=> this.choose(qName, index)}>{option}</p>;
    })
  }

  render() {
    const { qNames } = this.state;
    return (
      <div>
        <h2>Questionnaire</h2>
        <ul>
            {qNames.map((qName)=>{
              let ele = this.getQuestionEntity(qName);
              return ele.show && <li>
                <p>{ele.text}</p>
                {this.renderOption(ele, qName)}
                </li>
            })}
        </ul>
      </div>
    );
  }
}

export default Questionnaire;